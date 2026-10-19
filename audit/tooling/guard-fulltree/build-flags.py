"""Builds per-file flags from guard/gitleaks findings. Outputs ids, counts, lines, class labels only."""
import collections
import json
import os
import re
import sys

out_dir, repo = sys.argv[1], sys.argv[2]
findings = json.load(open(os.path.join(out_dir, "fulltree-findings.json")))
gitleaks = json.load(open(os.path.join(out_dir, "gitleaks-findings-stripped.json")))

cache = {}


def lines_of(p):
    if p not in cache:
        full = os.path.join(repo, p)
        if os.path.islink(full):
            cache[p] = [os.readlink(full)]
        else:
            cache[p] = open(full, encoding="utf-8", errors="replace").read().split("\n")
    return cache[p]


def line(p, n):
    L = lines_of(p)
    return L[n - 1] if n and 0 < n <= len(L) else ""


OWNER_HOMES = {"yournameisai", "macair", "yuai", "yu"}
EMAIL_RE = re.compile(r"(?<![A-Za-z0-9._%+-])[A-Za-z0-9._%+-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,}")


def email_class(addr):
    a = addr.lower()
    local, dom = a.split("@", 1)
    if dom == "gmail.com" or dom == "ai-love.cc":
        return "owner-personal-email"
    if dom.endswith(".local"):
        return "machine-local-email"
    if dom in ("anthropic.com",):
        return "public-org-email"
    if dom.endswith("agenttool.dev") and local in ("aurora",):
        return "project-agent-email"
    return "url-userinfo-or-fixture"


def home_class(text, rule):
    if rule == "personal/home-path":
        names = re.findall(r"/Users/([^/\s\"'`<>()\\,;:]+)", text)
    elif rule == "personal/unix-home-path":
        names = re.findall(r"(?<![\w.-])/home/([^/\s\"'`<>()\\,;:]+)", text)
    else:
        names = ["(win)"]
    if any(n in OWNER_HOMES for n in names):
        return "owner-machine-home"
    return "placeholder-or-ci-home"


def compact(nums, cap=14):
    nums = sorted(set(n for n in nums if n))
    if not nums:
        return ""
    ranges = []
    start = prev = nums[0]
    for n in nums[1:]:
        if n == prev + 1:
            prev = n
            continue
        ranges.append(f"{start}-{prev}" if prev != start else f"{start}")
        start = prev = n
    ranges.append(f"{start}-{prev}" if prev != start else f"{start}")
    if len(ranges) > cap:
        return ",".join(ranges[:cap]) + f",+{len(ranges) - cap} more"
    return ",".join(ranges)


DOC_EXT = (".md", ".txt", ".html", ".json", ".jsonld", ".yaml", ".yml", ".csv", ".jsonl")


def is_doc(p):
    return p.endswith(DOC_EXT) and not re.search(r"/(tests?|fixtures|vectors|schema|src|dist)/", p)


flags = []
by_file = collections.defaultdict(list)
for f in findings:
    if f["layer"] == "path":
        continue
    by_file[(f["path"], f["layer"])].append(f)

for (p, layer), fs in sorted(by_file.items()):
    allowed = [f for f in fs if f.get("allowedBy")]
    live = [f for f in fs if not f.get("allowedBy")]
    scope = fs[0]["scope"]
    sym = " symlink-target" if any(f.get("symlinkTarget") for f in fs) else ""
    if layer == "relational":
        rules = collections.Counter(f["rule"].split("/")[1] for f in live)
        if not live:
            flags.append({"path": p, "category": "relational", "action": "publish_ok_after_review", "confidence": "low",
                          "lines": compact([f.get("line") for f in allowed]),
                          "description": f"relational denylist hits ({','.join(sorted(collections.Counter(f['rule'].split('/')[1] for f in allowed)))}) already covered by approved denylist allow entries; in current 55-path projection"})
            continue
        n = len(live)
        total = max(1, len(lines_of(p)))
        rule_s = " ".join(f"{r}x{c}" for r, c in rules.most_common())
        if p == "public/private-guard/relational-denylist.json":
            action, conf, why = "keep_private_whole_file", "high", "the private relational denylist itself (term list + denylist-copy rule)"
        elif "/vendor/" in p:
            action, conf, why = "publish_ok_after_review", "low", "match inside vendored third-party code; likely incidental"
        elif is_doc(p) or p.endswith(".md"):
            if n >= 3 or n / total >= 0.01:
                action, conf = "keep_private_whole_file", "high"
            else:
                action, conf = "redact_lines", "high"
            why = "doc/prose"
        else:
            action, conf, why = "rewrite", "medium", "code/test/migration identifiers or strings"
        extra = f"; +{len(allowed)} already approved" if allowed else ""
        flags.append({"path": p, "category": "relational", "action": action, "confidence": conf,
                      "lines": compact([f.get("line") for f in live]),
                      "description": f"relational denylist {rule_s} ({n} lines of {total}; {why}; scope={scope}{extra})"})
    elif layer == "personal":
        groups = collections.defaultdict(list)
        for f in live:
            r = f["rule"]
            t = line(p, f.get("line"))
            if r in ("personal/home-path", "personal/unix-home-path", "personal/windows-home-path"):
                groups[(r, home_class(t, r))].append(f)
            elif r == "personal/email":
                classes = {email_class(m.group(0)) for m in EMAIL_RE.finditer(t)} or {"unparsed"}
                pick = "owner-personal-email" if "owner-personal-email" in classes else sorted(classes)[0]
                groups[(r, pick)].append(f)
            elif r == "personal/supabase-project":
                kind = "project-ref" if re.search(r"\b[a-z0-9]{20}\.supabase|postgres\.[a-z0-9]{20}|ref\W+[a-z0-9]{20}", t) else "pooler-host"
                if re.search(r"\babcd", t):
                    kind = "placeholder-ref"
                groups[(r, kind)].append(f)
            else:
                groups[(r, "")].append(f)
        for (r, cls), gs in sorted(groups.items()):
            rid = r
            lines_s = compact([f.get("line") for f in gs])
            n = len(gs)
            code = not (is_doc(p) or p.endswith(".md"))
            if r == "personal/supabase-project":
                if cls == "placeholder-ref":
                    cat, action, conf, d = "ops_sensitive", "publish_ok_after_review", "low", "placeholder hosted-DB project ref in guard test"
                elif cls == "project-ref":
                    cat, action, conf, d = "ops_sensitive", "rewrite", "high", "production hosted-DB project reference (+region/pooler host); not a credential but aids targeting"
                else:
                    cat, action, conf, d = "ops_sensitive", "publish_ok_after_review", "medium", "hosted-DB regional pooler hostname (production region disclosed)"
            elif r == "personal/email":
                cat = "personal"
                if cls == "owner-personal-email":
                    action, conf, d = "redact_lines", "high", "owner's personal email address(es)"
                elif cls == "machine-local-email":
                    action, conf, d = "redact_lines", "medium", "address at the owner's machine-local hostname"
                elif cls == "public-org-email":
                    action, conf, d = "publish_ok_after_review", "low", "public organisation address (e.g. commit co-author trailer)"
                elif cls == "project-agent-email":
                    action, conf, d = "publish_ok_after_review", "low", "project-domain agent address"
                else:
                    action, conf, d = "publish_ok_after_review", "low", "URL userinfo / fixture address, not a person (guard false positive)"
            elif r in ("personal/home-path", "personal/unix-home-path", "personal/windows-home-path"):
                cat = "personal"
                if cls == "owner-machine-home":
                    action, conf, d = ("rewrite" if code else "redact_lines"), "high", "owner's machine-local home path(s) (account names on owner's Macs)"
                else:
                    action, conf, d = "publish_ok_after_review", "low", "placeholder/CI home path not in guard's placeholder set"
            elif r == "personal/keychain-slot":
                cat, action, conf, d = "personal", ("rewrite" if code else "redact_lines"), "medium", "local keychain slot name(s) (operator secret-store inventory; some embed owner/persona names)"
            elif r == "personal/device-path":
                cat, action, conf, d = "personal", ("rewrite" if code else "redact_lines"), "high", "owner device path (Desktop / local config dir / private project dir)"
            else:
                cat, action, conf, d = "personal", "redact_lines", "medium", r
            extra = f"; +{len(allowed)} approved" if allowed else ""
            flags.append({"path": p, "category": cat, "action": action, "confidence": conf, "lines": lines_s,
                          "description": f"{rid} x{n}: {d}{sym} (scope={scope}{extra})"})
        if not live and allowed:
            flags.append({"path": p, "category": "personal", "action": "publish_ok_after_review", "confidence": "low",
                          "lines": compact([f.get("line") for f in allowed]),
                          "description": f"{','.join(sorted({f['rule'] for f in allowed}))}: already approved in public-guard-allow.json; in current projection"})
    elif layer == "secret":
        rules = collections.Counter(f["rule"] for f in live)
        flags.append({"path": p, "category": "secret", "action": "publish_ok_after_review", "confidence": "high",
                      "lines": compact([f.get("line") for f in live]),
                      "description": f"{' '.join(f'{r}x{c}' for r, c in rules.items())}: verified fake/empty PEM header in a test fixture (no key body) (scope={scope})"})

# gitleaks (uncovered + covered)
GL_NOTE = {
    "api/scripts/x402-eip3009-vector.ts": "well-known public Anvil dev private keys (test vector, commented as unfunded)",
    "api/tests/x402-client.test.ts": "well-known public Anvil dev private key in test",
    "api/src/services/billing/stripe-checkout.ts": "Stripe test-mode placeholder key literal (fallback never used for API calls)",
    "api/tests/identity-token-boundary.test.ts": "fake token literal in test",
    "api/tests/doctrine/promise-04-substrate-yours.test.ts": "fake credential literal in test",
    "api/tests/fixtures/crown-vectors.json": "did:key identifiers + public keys/signatures in test vectors (no private material)",
    "api/tests/pulse-did.test.ts": "test DID string",
    "docs/superpowers/plans/2026-05-10-pulse-mood-drift-and-did-route.md": "test DID string in plan",
    "docs/superpowers/specs/2026-05-10-pulse-mood-drift-and-did-route-design.md": "prose identifiers (false positive)",
    "bin/tests/test_care_before_learning_hf_release.py": "fake secret literal in test",
    "packages/lobby/tests/fixtures/egress-cases.json": "fake PEM block in egress-refusal fixture",
    "apps/docs/geometry/index.json": "public git commit SHAs + preview deployment URL in release metadata (not a key)",
    "packages/collab/dist/agenttool-collab-host.js": "operation-name false positive; .gitleaksignore fingerprints for this file drifted (recorded 3127/3131, now 3128/3132) -> guard would report 2 unused fingerprints + 2 raw findings",
}
gl_files = collections.defaultdict(list)
for r in gitleaks:
    gl_files[r["path"]].append(r)
for p, rs in sorted(gl_files.items()):
    un = [r for r in rs if not r.get("ignoredBy")]
    cov = [r for r in rs if r.get("ignoredBy")]
    if un:
        rules = collections.Counter(r["rule"] for r in un)
        cat = "ops_sensitive" if p == "apps/docs/geometry/index.json" else "secret"
        flags.append({"path": p, "category": cat, "action": "publish_ok_after_review",
                      "confidence": "high" if p != "docs/superpowers/specs/2026-05-10-pulse-mood-drift-and-did-route-design.md" else "medium",
                      "lines": compact([r["line"] for r in un]),
                      "description": f"gitleaks {' '.join(f'{k}x{v}' for k, v in rules.items())} not covered by .gitleaksignore: {GL_NOTE.get(p, 'review')}"})
    if cov:
        rules = collections.Counter(r["rule"] for r in cov)
        flags.append({"path": p, "category": "secret", "action": "publish_ok_after_review", "confidence": "low",
                      "lines": compact([r["line"] for r in cov]),
                      "description": f"gitleaks {' '.join(f'{k}x{v}' for k, v in rules.items())} covered by existing overlay/.gitleaksignore fingerprints (hash-verified)"})

json.dump(flags, open(os.path.join(out_dir, "flags.json"), "w"), indent=0)
print("flags", len(flags))
print(collections.Counter((f["category"], f["action"]) for f in flags))
