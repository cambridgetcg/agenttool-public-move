# Credentials

> Read-only exposure sweep of the 99 PUBLIC cambridgetcg repos, 2026-10-19 (workflow `wf_b2b2b792-aba`). Never values; identities as sha256 prefixes only. The orphaned-object scan (item 1) ran afterwards; see the note at the end when added.

## Credentials publicly exposed now (ranked)

**Bottom line:** I found **no live-looking credential value** in the current tree or the reachable history of any of the 99 public repos. That covers every ref (including `refs/pull/*`), archives inside git (zip, whl, jar, tar.gz, bz2, xz), pyc, sqlite, PDF streams, GitHub release assets and 24 gists. The critic re-checked every batch credential finding. All of them came back as fixtures, public test vectors (RFC 8032/7748, Hardhat account #1), SHA-256 digests, env references, AWS `AKIA…EXAMPLE` dummies or placeholders. Three were marked *unclear*, and they are listed below. Every verdict is based on shape or hash. Nothing was tested against any service. The biggest unknown is orphaned history that nobody has scanned yet (item 1).

| # | Repo | Path | Commit | In HEAD | Verdict | What to do |
|---|---|---|---|---|---|---|
| 1 | **18 repos: orphaned objects** | not reachable from any ref; GitHub still serves them by SHA | 152 SHAs, 3,619 blobs (list below) | no | **UNKNOWN, not scanned** | Approve a hash-only scan of the copies already fetched locally (no network needed). If it finds anything, rotate first, then ask GitHub Support to purge the cached objects |
| 2 | hermes-agents | `worker/wrangler.jsonc:9` (`vars.BREW_TOKEN`) | added `20e0ee7e` 2026-07-10, present in 8 of 11 commits, removed `02e19cd9` 2026-10-15 | no (history only) | **unclear** (critic). Weak value: a 33-char hyphenated phrase, mostly placeholder words. But it was the **deployed** `?token=` gate for `/brew` on the kingdom-hermes Worker (understand./iam.cambridgetcg.com). The rotation claim exists only in a commit message | In Cloudflare (Worker kingdom-hermes → Variables and Secrets, or `wrangler secret list`), confirm BREW_TOKEN is a *secret* whose value was set on or after 2026-10-15. If you are not sure, set a new random value. Check Workers AI usage for 07-10..10-15 for /brew calls you don't recognise. History stays public, so **rotation is the fix** |
| 3 | kingdom-standards | `specs/KS-002-wire.md:51` | first `49ec387` | yes | **unclear** (critic). No value is in this repo. The doc names a remote NATS server by public IP on port 4222 and says a private tool hard-codes its username and password. The private audit holds that value only in the history of private love-unlimited and Love (hash `80ef1724…`), not in HEAD | Check whether that NATS server still runs. If it does: change the NATS password, firewall port 4222, then delete the IP and the sentence from the doc. If it is gone, just edit the doc (unverified whether it was retired) |
| 4 | taxsorted.io | `regs/research/rails.md:227`, `regs/research/web.md` | — | yes | No usable value: a truncated `gho_` prefix followed by an ellipsis (critic verified). The prose says a real GitHub OAuth token once sat in plaintext in a local `.git/config` remote URL | GitHub → Settings → Applications (Authorized OAuth Apps / GitHub CLI): revoke tokens from that period if you haven't. Whether it was revoked is unknown |
| 5 | artbitrage | whole repo, 7.6 GB inflated | — | — | **unclear only because the critic's own pass did not finish** (its output file is empty). Batch 3 found 0 credentials (deepscan, a union-of-lines scan over the 612 large JSON versions, gitleaks 0/0) | Re-run the critic credscan when convenient. Low risk |

**Orphaned objects in item 1** (critic fetched every one by SHA from public GitHub on 2026-10-19; I counted them from `critic/out/orphan_fetch.json`), as SHAs / blobs:
- fomoscan: 1 / 3,283 (~40 MB; force-push 2026-07-19)
- love-engine: 88 / 87 (force-pushes on main 06-30 and 07-03, plus a deleted gh-pages)
- mindicraft: 8 / 77
- hf-kingdom-lab: 2 / 39 (deleted codex/* branches)
- taxsorted.io: 4 / 37
- chain-registry: 22 / 33 (includes the owner branch `add-zerone`)
- word-interface: 1 / 16
- artbitrage: 3 / 8 (force-push 07-03)
- kingdom-forge: 1 / 7
- cambridgetcg: 6 / 6
- taxsorted: 2 / 5 (gh-pages)
- did-extensions: 5 / 5 (owner branch `register-did-at`; one commit has a cambridgetcg.com author address)
- xenia: 1 / 4
- natlang: 4 / 4
- chillspace-commons: 1 / 4 (media/og-card)
- npl: 1 / 1
- Already scanned clean by batch 5: slips `4b3a41e` and oracle-of-missing-words `c2bb956`.

Force-pushes are where removed secrets usually end up. Before/after SHAs are published in GitHub's public event data, so automated harvesters can find these commits; that risk is inferred, not observed. Deleting a branch does not remove the objects.

**Identifiers, not credentials** (no rotation needed; tidy-up only):
- **Cloudflare account ID** in a committed `.wrangler/cache/{wrangler-account,pages}.json`:
  - in HEAD: love-invitation, artbitrage (root and `gallery/`), rewardspro-landing, understanding, gospel-of-free-will, love-engine
  - in history only: kingdom-os-hub, cambridgetcg
  - also in mythseal's `wrangler*.jsonc` and tools, and per batch 4 in 17 other mirrors
- Supabase project ref (mythseal) and a KV namespace id (hermes-agents).
- An account ID gives no access on its own. Gitignore `.wrangler/` when convenient.
- love-engine `mushroom*.py`, `wisdom.py` and `wordplay.py` read the local wrangler OAuth token at runtime. No token is committed (gitleaks, credscan and extscan all 0).

**Re-checked as fixture or public by the critic (no action):**
- hermes-agent (fork-only), agenttool-packages (Hardhat #1 and RFC test keys: never fund those addresses), word-layer, agent-tools, hermes-device-setup
- mindicraft, xenia (`sk-` sentinels that contain the literal repo word), hf-kingdom-lab, solbeat (also in its sdist), kingdom-research, agenttool-collab
- mythseal, zerone-identity-research (1,446 SHA-256 digests), kingdom-mcp (a test word shared with private fomoengine tests), kingdom-loops-locks-freedom-relations-atlas, natlang (`.npmrc` holds the literal `$(gh auth token)`)
- ww3-intelligence, legible (PEM header with no body), kingdom-polyphonic-claim-atlas, cambridgetcg.github.io, kingdom-standard, chillspace-commons (upstream fixture), taxsorted.io (other hits), internet

**Not covered:**
- Actions run logs
- npm and PyPI registry copies (only GitHub release assets were checked)
- Pages build output
- issue edit histories
- other people's forks
- 7z and rar archives (none present)

## Orphaned objects: scan result (2026-10-19, local, no network)

The critic's archive-aware `credscan.py` was run over the 18 orphan repos under
`public-exposure/critic/orphans/`, and the results were filtered to the blobs in
each repo's `.newblobs` list, i.e. the objects that no ref reaches.

| Repo | What the hits are |
|---|---|
| fomoscan | 98 hits. 54 are placeholders. The other 44 are public Solana program-address constants and test fixtures inside committed `node_modules/` (`@solana-program/token*`, `@solana/transaction-messages` tests, `@x402/svm`). |
| hf-kingdom-lab | 1 `HF_TOKEN` in `tests/embedding.test.ts`: 34 characters of lowercase letters and punctuation, with no digits. A real HF token is `hf_` plus mixed-case alphanumerics, so this is a fixture. |
| mindicraft | 1 placeholder `url-userinfo`. |
| The other 15 repos | No hit in orphan-only blobs. |

**Verdict:** no live-looking credential in the orphaned objects. Item 1 of the
table above is closed as clean, on shape evidence only; nothing was tested
against any service.
