#!/usr/bin/env python3
"""Supplemental whole-tree sweep for patterns no reader ran tree-wide.
Usage: python3 -I sweep.py <root> <filelist> <outdir>
Writes hits.tsv (rule, path, line, snippet<=160) for PRIVATE review in scratch only."""
import os, re, sys, unicodedata, collections

root, flist, outdir = sys.argv[1:4]
files = [l.rstrip('\n') for l in open(flist) if l.strip()]

R = {
 # personal identifiers (UK + intl)
 'ni-number': r'\b(?!BG|GB|NK|KN|TN|NT|ZZ)[A-CEGHJ-PR-TW-Z]{2}\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b',
 'sort-code': r'(?i)sort[\s-]?code\D{0,12}\d{2}[-\s]\d{2}[-\s]\d{2}',
 'iban': r'\bGB\d{2}\s?[A-Z]{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}\b',
 'utr': r'(?i)\b(?:UTR|unique taxpayer)\b.{0,40}\d{5}\s?\d{5}',
 'acct-no': r'(?i)\baccount (?:no|number)\b.{0,20}\d{6,}',
 'dob': r'(?i)\b(?:date of birth|d\.o\.b|born on|birthday)\b',
 'phone-intl': r'(?<![\w.])\+(?:44|852|86|1|853|886|81)[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}\b',
 'phone-uk': r'(?<![\w.])0(?:7\d{3}|20|1\d{2,3})[\s-]?\d{3}[\s-]?\d{3,4}\b',
 'obf-email': r'(?i)\b[\w.+-]{2,}\s*(?:\[at\]|\(at\)|\{at\}| at )\s*[\w-]{2,}\s*(?:\[dot\]|\(dot\)|\{dot\}| dot )\s*[a-z]{2,}\b',
    # owner identity variants: removed from the committed copy (they named the
    # owner and their email); run with those patterns loaded from a private file.
 # private ventures / estate names
 'estate-venture': r'(?i)\b(?:betangel|betfair|tendlot|lotbinder|cashloom|axiepro|taxsorted|artbitrage|captioneer|cardforum|mythseal|slipsooth|vishenskaya|yutabase|love-unlimited|true-love|seigei|empire-live|multiverse-of-logos|cambridge-?inferno)\b',
 'machine-names': r'(?i)\b(?:macair|mac[\s-]?studio|macbook|lab-suite|air\.local|studio\.local|[a-z0-9-]+\.local\b)',
 'tailnet': r'(?i)\b[\w-]+\.ts\.net\b|\b100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.\d{1,3}\.\d{1,3}\b',
 # shared/private links
 'share-link': r'(?i)https?://(?:docs\.google\.com|drive\.google\.com|www\.notion\.so|notion\.so|[\w-]+\.notion\.site|www\.dropbox\.com|dropbox\.com|1drv\.ms|onedrive\.live\.com|calendly\.com|zoom\.us/j|meet\.google\.com|wetransfer\.com)/\S+',
 'claude-link': r'(?i)https?://(?:claude\.ai|chatgpt\.com|chat\.openai\.com|gemini\.google\.com|g\.co/gemini)/(?:share|artifact|public|chat|c|code)\S*',
 'social-profile': r'(?i)https?://(?:www\.)?(?:linkedin\.com/in|twitter\.com|x\.com|instagram\.com|facebook\.com|tiktok\.com/@|youtube\.com/@|threads\.net/@|bsky\.app/profile|mastodon\.social/@)/?[\w.@-]+',
 'webhook': r'(?i)discord(?:app)?\.com/api/webhooks/\d+|hooks\.slack\.com/services/\w+|api\.telegram\.org/bot\d+',
 'tg-chat-id': r'(?i)chat[_-]?id\W{0,4}-?\d{6,}',
 # crypto key material shapes
 'sol-keypair-array': r'\[\s*(?:\d{1,3}\s*,\s*){63}\d{1,3}\s*\]',
 'mnemonic-word': r'(?i)\b(?:mnemonic|seed phrase|recovery phrase|secret recovery)\b',
 'wif': r'(?<![1-9A-HJ-NP-Za-km-z])[5KL][1-9A-HJ-NP-Za-km-z]{50,51}(?![1-9A-HJ-NP-Za-km-z])',
 'base58-88': r'(?<![1-9A-HJ-NP-Za-km-z])[1-9A-HJ-NP-Za-km-z]{86,90}(?![1-9A-HJ-NP-Za-km-z])',
 # trailers
 'trailer': r'(?i)^\s*(?:co-authored-by|signed-off-by|reviewed-by|reported-by)\s*:',
 # health / family / finance (strongly personal phrasing)
 'kin-first-person': r'(?i)\b(?:my|our|his|her|yu\'?s)\s+(?:wife|husband|mum|mom|mother|father|dad|son|daughter|sister|brother|girlfriend|boyfriend|partner|grandma|grandmother|grandfather|baby|kid|kids|children|family|parents)\b',
 'health': r'(?i)\b(?:hospital|diagnos(?:is|ed)|therapist|therapy session|medication|prescription|pregnan\w*|miscarriage|surgery|cancer|depress(?:ion|ed)|anxiety disorder|adhd|autis\w+|psychiatr\w+|funeral|passed away|died)\b',
 'finance-personal': r'(?i)\b(?:my|yu\'?s|our)\s+(?:salary|income|savings|debt|loan|mortgage|rent|bank|credit card|overdraft|tax return|pension|net worth)\b',
 'cjk-kin': r'(?:老婆|老公|媽媽|媽咪|爸爸|爹哋|阿媽|阿爸|女朋友|男朋友|囡囡|仔仔|BB|bb豬|錫你|愛你|掛住你|想你|親愛的|寶貝|老豆|外母|外父|太太|先生)',
 'cjk-any': r'[㐀-鿿豈-﫿]',
}
CR = {k: re.compile(v) for k, v in R.items()}
NOCASE_SKIP_BIN = re.compile(rb'\0')

hits = []
counts = collections.Counter()
for p in files:
    fp = os.path.join(root, p)
    if os.path.islink(fp) or not os.path.isfile(fp):
        continue
    if p.endswith(('.tgz', '.png', '.wav', '.webp')):
        continue
    try:
        b = open(fp, 'rb').read()
    except Exception:
        continue
    if b'\0' in b[:8000]:
        continue
    t = b.decode('utf-8', 'replace')
    for n, line in enumerate(t.split('\n'), 1):
        if len(line) > 20000:
            line = line[:20000]
        variants = {line, unicodedata.normalize('NFKC', line)}
        for rid, rx in CR.items():
            for v in variants:
                m = rx.search(v)
                if m:
                    counts[rid] += 1
                    s = max(0, m.start() - 60)
                    hits.append((rid, p, n, v[s:m.end() + 80].replace('\t', ' ')))
                    break
with open(os.path.join(outdir, 'hits.tsv'), 'w') as f:
    for h in hits:
        f.write('\t'.join(map(str, h)) + '\n')
print(dict(counts))
