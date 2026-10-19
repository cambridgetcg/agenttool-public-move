#!/usr/bin/env python3
"""Context-pattern person-name extraction. Usage: names.py <root> <filelist> <out.tsv>"""
import os, re, sys, collections
root, flist, out = sys.argv[1:4]
files = [l.rstrip('\n') for l in open(flist) if l.strip()]
PAT = re.compile(r"\b(?:(?:Mr|Mrs|Ms|Miss|Dr|Prof)\.? [A-Z][a-z]+|[Dd]ear [A-Z][a-z]{2,}|[Tt]hanks? to [A-Z][a-z]{2,}|(?:friend|partner|artist|client|customer|colleague|cousin|uncle|aunt|neighbou?r|landlord|accountant|lawyer|solicitor|girlfriend|boyfriend|fianc[eé]e?|painter|sculptor|photographer|musician|teacher|mentor|cofounder|co-founder|investor|boss|manager) (?:called |named )?[A-Z][a-z]{2,}|(?:met|meeting|call|dinner|lunch|coffee|chat|talked|spoke) with [A-Z][a-z]{2,}|[A-Z][a-z]{2,}'s (?:wife|husband|mum|mom|mother|father|dad|son|daughter|sister|brother|girlfriend|boyfriend|partner|family|studio|gallery|shop|paintings?|art))")
SKIP = re.compile(r'\.(?:lock|tgz|png|wav|webp)$|/dist/')
c = collections.Counter(); rows = []
for p in files:
    if SKIP.search(p): continue
    fp = os.path.join(root, p)
    if os.path.islink(fp) or not os.path.isfile(fp): continue
    b = open(fp, 'rb').read()
    if b'\0' in b[:8000]: continue
    for n, line in enumerate(b.decode('utf-8', 'replace').split('\n'), 1):
        for m in PAT.finditer(line[:20000]):
            c[m.group(0)] += 1
            rows.append((m.group(0), p, n, line[max(0, m.start()-80):m.end()+100].replace('\t', ' ')))
with open(out, 'w') as f:
    for r in rows: f.write('\t'.join(map(str, r)) + '\n')
for k, v in c.most_common(400): print(v, k)
