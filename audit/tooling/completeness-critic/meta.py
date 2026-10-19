#!/usr/bin/env python3
"""Read-only metadata dump for media/binary files. Usage: meta.py <root> <listfile> <out.json>
Reads blobs via the working tree (files only, symlinks skipped). Prints keys and short,
truncated values; caller reviews the output privately."""
import json, os, struct, sys, tarfile, gzip, io, re, zlib

root, listfile, out = sys.argv[1], sys.argv[2], sys.argv[3]
paths = [l.strip() for l in open(listfile) if l.strip()]
res = {}

def trunc(b, n=300):
    if isinstance(b, bytes):
        b = b.decode('utf-8', 'replace')
    return b[:n]

def png(data):
    r = {"chunks": [], "text": []}
    if data[:8] != b'\x89PNG\r\n\x1a\n':
        return {"err": "not png"}
    i = 8
    while i + 8 <= len(data):
        ln, = struct.unpack('>I', data[i:i+4]); typ = data[i+4:i+8].decode('latin1')
        body = data[i+8:i+8+ln]
        r["chunks"].append(typ)
        if typ == 'tEXt':
            k, _, v = body.partition(b'\0'); r["text"].append([trunc(k), trunc(v)])
        elif typ == 'zTXt':
            k, _, v = body.partition(b'\0')
            try: v = zlib.decompress(v[1:])
            except Exception: v = b'<zerr>'
            r["text"].append([trunc(k), trunc(v)])
        elif typ == 'iTXt':
            k, _, rest = body.partition(b'\0')
            comp = rest[0]; rest = rest[2:]
            lang, _, rest = rest.partition(b'\0'); tk, _, txt = rest.partition(b'\0')
            if comp:
                try: txt = zlib.decompress(txt)
                except Exception: txt = b'<zerr>'
            r["text"].append([trunc(k), trunc(txt, 2000)])
        elif typ == 'eXIf':
            r["text"].append(['eXIf', trunc(re.sub(rb'[^\x20-\x7e]+', b' ', body), 600)])
        elif typ == 'iCCP':
            k, _, _ = body.partition(b'\0'); r["text"].append(['iCCP-name', trunc(k)])
        elif typ == 'tIME':
            r["text"].append(['tIME', list(struct.unpack('>HBBBBB', body))])
        elif typ == 'IHDR':
            r["dims"] = list(struct.unpack('>II', body[:8]))
        i += 12 + ln
    r["chunks"] = sorted(set(r["chunks"]))
    return r

def riff(data):
    r = {"chunks": [], "info": []}
    if data[:4] != b'RIFF':
        return {"err": "not riff"}
    r["form"] = data[8:12].decode('latin1')
    def walk(buf, start, end, depth):
        i = start
        while i + 8 <= end:
            cid = buf[i:i+4].decode('latin1'); ln, = struct.unpack('<I', buf[i+4:i+8])
            body = buf[i+8:i+8+ln]
            r["chunks"].append(("  " * depth) + cid + f"({ln})")
            if cid == 'LIST':
                r["chunks"].append(("  " * depth) + "  type=" + body[:4].decode('latin1'))
                walk(buf, i + 12, i + 8 + ln, depth + 1)
            elif cid in ('EXIF', 'XMP ', 'bext', 'iXML', 'id3 ', 'ID3 ', 'IART', 'ICMT', 'INAM', 'ISFT', 'ICOP', 'ICRD', 'IENG', 'ITCH', 'ISBJ', 'IKEY', 'IPRD', 'IGNR') or depth > 0:
                if cid not in ('data', 'fmt ', 'VP8 ', 'VP8L', 'VP8X', 'ALPH', 'ANIM', 'ANMF', 'ICCP'):
                    r["info"].append([cid, trunc(re.sub(rb'[^\x20-\x7e]+', b' ', body), 1500)])
            i += 8 + ln + (ln & 1)
    walk(data, 12, len(data), 0)
    return r

def svg(data):
    t = data.decode('utf-8', 'replace')
    r = {}
    for pat in [r'<metadata[\s\S]*?</metadata>', r'(?:inkscape|sodipodi):[a-z-]+="[^"]*"', r'<!--[\s\S]*?-->', r'(?:/Users/|/home/|C:\\\\)[^"\'<\s]*', r'<(?:dc:)?(?:creator|title|rights|publisher|contributor)[\s\S]*?</']:
        m = re.findall(pat, t)
        if m: r[pat[:20]] = [x[:300] for x in m[:10]]
    r["len"] = len(t)
    return r

def tgz(data):
    r = {}
    # gzip header
    if data[:2] == b'\x1f\x8b':
        flg = data[3]; mtime, = struct.unpack('<I', data[4:8]); r["gz_mtime"] = mtime; r["gz_os"] = data[9]
        if flg & 8:
            end = data.index(b'\0', 10); r["gz_fname"] = trunc(data[10:end])
    tf = tarfile.open(fileobj=io.BytesIO(data), mode='r:gz')
    owners = set(); mt = set(); nontext = []; pax = set()
    for m in tf.getmembers():
        owners.add((m.uname, m.gname, m.uid, m.gid)); mt.add(m.mtime)
        if m.pax_headers: pax.update(f"{k}={str(v)[:80]}" for k, v in m.pax_headers.items() if k not in ('path', 'linkpath', 'size'))
        if m.isfile():
            f = tf.extractfile(m); head = f.read(8000)
            if b'\0' in head or re.search(r'\.(png|jpe?g|gif|webp|wav|woff2?|ttf|otf|ico|pdf)$', m.name, re.I):
                nontext.append(m.name)
    r["owners"] = sorted([list(map(str, o)) for o in owners])
    r["mtimes"] = sorted(mt)[:5]; r["n_mtimes"] = len(mt)
    r["pax"] = sorted(pax)[:20]; r["nontext"] = nontext
    return r

for p in paths:
    fp = os.path.join(root, p)
    if os.path.islink(fp):
        res[p] = {"symlink": True}; continue
    data = open(fp, 'rb').read()
    low = p.lower()
    try:
        if low.endswith('.png'): res[p] = png(data)
        elif low.endswith('.wav') or low.endswith('.webp'): res[p] = riff(data)
        elif low.endswith('.svg'): res[p] = svg(data)
        elif low.endswith('.tgz'): res[p] = tgz(data)
        else: res[p] = {"size": len(data)}
    except Exception as e:
        res[p] = {"err": repr(e)}
json.dump(res, open(out, 'w'), indent=1, default=str)
print("ok", len(res))
