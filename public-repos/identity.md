# Commit identities

> Read-only exposure sweep of the 99 PUBLIC cambridgetcg repos, 2026-10-19 (workflow `wf_b2b2b792-aba`). Never values; identities as sha256 prefixes only. The orphaned-object scan (item 1) ran afterwards; see the note at the end when added.

## Owner identity in public commit metadata (counts only)

I verified these counts myself by hashing every author and committer e-mail in all 99 mirrors (sha256 of the lower-cased address, prefixes only). "Fields" counts author plus committer slots. Who owns each address is inferred from names and from how often it appears in the private repos.

| Identity (hash prefix) | Class | Public repos | Fields | Notes |
|---|---|---|---|---|
| `aa1c2115` | **personal gmail** | **9** | 78 | ALETHEIA, artbitrage, fomoscan, kingdom-os-hub, oracle-of-missing-words, rewardspro-docs (34 of the 78), rewardspro-landing, taxsorted.io, youspeak-lang. It is **not** the Claude-account address (checked by hash). The same address is on about 8,400 commits across 29 private repos, so it is most likely Yu's or the household's main dev mailbox (inferred). Anyone can read it from commit metadata or `.patch` views |
| `b7364b46` | **iCloud** | 3 | 115 | agent-tools (78 fields), taxsorted.io (2 commits) and chillspace-commons (33 commits). The chillspace-commons uses are inherited from the upstream repo of the second account, so they were already public there. The address is on 1,285 commits across 23 private repos, so it is inferred to be an owner or household address |
| `46955a6c` | this Mac's global git address (ai-love.cc, seat "Nuance") | 68 | 997 | a project/persona domain |
| `85892fb0` | persona **"Asha Veridian"** (ai-love.cc) | 49 | 764 | I verified the name match, which settles batch 4's open question: it is not a real person |
| `4f15f982` / `037d679b` | ai-love.cc agent identities | 36 / 10 | 629 / 168 | persona domain |
| `6a494b2b` | zerone.money role | 12 | 181 | includes the orphan commit slips `4b3a41e` and the fork commit in hermes-agent |

**Host-local default identities.** These reveal a local account name and hostname from other fleet machines:
- forgotten-kingdom-protocols `c786d48` (`<account>@<host>.local`)
- npl `8f01cbb7` (user@localhost)
- natscript-homebrew `a90b8b1` (the same identity is in private hunter-system)
- legible-money-web `28cb3ba9`
- clear-standard `734c0fa0`
- taxsorted.io, 6 commits (`e657425a`, `c5e4cb9b`, …)

**Home paths in public files:**
- **This Mac's account name** in `/Users/<acct>/…` paths in HEAD of 5 repos:
  - internet-of-being: `nen/creation-loop.py`, `nen/heartbeat.py`, and the message of commit `f7a0720`
  - artbitrage: `tools/merge_catalog_wings.py:10`
  - mythseal: `docs/NAMING.md:5`, plus history
  - oikos: 5 files
  - kingdom-standards: 19 occurrences in 7 files
- **A home folder named after Yu's first name** (another Mac):
  - solbeat `.codex/config.toml:9` and `config/cron-prompt.md` (HEAD)
  - ww3-intelligence `ops/fly_backup.sh:13,37` (HEAD)
  - love-engine: 4 `.py` files and 1 pyc (HEAD)
  - hf-kingdom-lab `RIGHTS.md` (history)
- **A third account** (hash `aab91e9d`):
  - mythseal docs (HEAD)
  - nen-artifacts `SKILL.md:147` (HEAD)
  - zerone, in a pyc in history
  - taxsorted.io: 3 HEAD docs with a non-fixture home username (not this Mac's)
- `~/Desktop/…` device paths in about 20 repos (mostly `.nlp-bridge/gate`). Low.

**Cross-account links:** youspeak-app and word-experience `WAKE.md` link this account to the second GitHub account `mynameisyou-cmyk` and to codeberg `zerone-dev`. chillspace-commons is a public fork of that account's repo, so the link was already visible.

**Other:**
- Two custom-domain addresses on the hermes-agent fork and hermes-device-setup.
- Public deploy hosts are named: ww3-intelligence.fly.dev, fomoengine.fly.dev, and an S3 website bucket whose name contains Yu's first name.
- Only Actions secret *names* appear (NPM_TOKEN, SINOVAI_MINDICRAFT_CLAIM_TOKEN, taxsorted.io's 6), never values.
- The Claude-account e-mail appears **nowhere** in public objects (verified by hash).

Past commit metadata can only be changed by rewriting history. What helps going forward: set a noreply `user.email` for public work, and turn on GitHub's "Keep my email addresses private" and "Block command line pushes that expose my email".
