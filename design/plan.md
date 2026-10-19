# Public development repo with merge-back: plan (2026-10-19)

> Design workflow `wf_9a000583-44b`: three independent designs, a leak-safety judge, an engineering judge, a synthesis and a completeness critic. It follows Yu's firm decision in `decisions/2026-10-19-topology.md`. Nothing here has been executed. The critic's findings at the end are **not yet folded into the plan text**; the two marked `must` have to be fixed before P0.

# agenttool: public development repo, merged back into private — final plan

Synthesis of three designs and two judgments, 2026-10-19. Design only: nothing was created, pushed or changed. Source read: `/Users/macair/agenttool-wt-1019/topo-src` (detached origin/main 3b9aa630). New rehearsal: synthetic local repos only, 39/39 checks passed. Script: `/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/topo-design/synthesizer/rehearsal.sh`. Log: `/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/topo-design/synthesizer/run.log`. Plan copy: `/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/topo-design/synthesizer/plan.md`.

## 0. The decision and the shape that carries it out

Yu, 2026-10-19, firm: open a **new public repo**, develop there, **merge it back into the private repo periodically**; secret, personal and relational material stays private only.

| | What it is |
|---|---|
| **P** | New public repo `cambridgetcg/<NAME>` (recommended `agenttool-open`; GET returned 404, so the name looks free). Created fresh, never a fork. Not `agenttool` (12+ local checkouts and name-bound trusts point there) and not `agenttool-packages` (Yu asked for a new repo). Shared code is developed here through PRs, with free CI. |
| **R** | Private `cambridgetcg/agenttool`. Same name, full history, still live. Its tree is always **P's tree byte for byte, plus R-only paths**. R keeps deploy, the npm projection lane, PyPI, the denylist and all private material. |
| **P → R** | A real `git merge` of public main into private main: weekly, and on demand. |
| **R → P** | Only the **export tool**. It writes allowlisted blobs from R into a P clone as plain files, runs every guard layer, and commits them with the public identity, so P never fetches an R object. It is used for P0, for each widening, and for upstreaming a fix. |
| **Merge base** | Right after P0 is public, R records it with a single `-s ours` adoption merge, guarded by a subset check that can actually fail. From then on `git merge-base` returns the last merged public tip, and every merge-back is an ordinary three-way merge. |
| **Scope** | Staged. P0 is the package scope that is already public through agenttool-packages (1,618 allowlisted files, plus about 53 newer changes, plus public root files). It needs no content rulings and no change to deploy, release or secrets. More areas are added later by export PRs. api/, apps/ and docs/ follow only after Yu's batch rulings. |

```
  R (private: deploy, npm projection, PyPI, private/)            P (public: PRs, free CI)
  ─────────────────────────────────────────────────            ─────────────────────────
        │  export: allowlisted blobs → files in a P clone → guard → PR  ──────────▶ │
        │ ◀────────── git merge public/main  (weekly + on demand, agent-run) ───────│
        └─ project-public → agenttool-packages → npm (unchanged lane)
```

### Invariants (every mechanism below exists to keep these true)
- **I1. P ⊆ R, byte-identical.** `git diff --no-renames --name-only --diff-filter=DMT <public tip> <R main>` is empty. Every P path exists in R with the same mode and blob.
- **I2. R-only paths come in two kinds.**
  - Permanent: under `private/`, or a workflow named `private-*.yml`. Workflows whose name an external trust binds (`publish-pypi.yml`, the HF publish workflow) keep their names.
  - Transitional: areas not yet widened. This set shrinks to almost nothing after stage 3.
- **I3. Shared paths change only in P.** R refuses and detects edits to them (pre-commit hook, pre-push hook, the merge-back drift check).
- **I4. P holds no R object except blobs byte-identical to exported public files.** No R commit, tree or history ever enters P, and P has exactly one root, P0.
- **I5. Relocate before widening.** Before an area is widened, its keep-private files move into `private/` and its rewrite/redact paths are resolved in place, so no private file stays inside a shared directory. The rehearsal showed why (check 28): a private file left inside a shared directory, plus a public rename of that directory, gives a conflict.

## 1. Where the pieces come from, and how each fatal flaw the judges raised is fixed

**What was taken from each design:**
- **From D3** (packages-first, the leak-safety judge's winner):
  - start with the scope that is already public;
  - fail-closed hooks;
  - an export that writes files, so objects stay isolated;
  - create P as private, check the server copy, then flip to public;
  - the 10 root collisions;
  - the wallet gate;
  - the `GUARD_SOURCE` fix.
- **From D1** (shared-history overlay, the friction judge's winner):
  - a single root `private/` namespace;
  - the adoption merge used as the merge base;
  - a public commit identity;
  - generators that exclude `private/`;
  - errors that print only checksums;
  - the `file:///dev/null` pushurl;
  - the PostgreSQL proof that 30 data-only migrations can be skipped and 10 DDL ones cannot.
- **From D2:**
  - deploy stays in R, gated on the public CI run of the merged public tip;
  - single-root and canary checks;
  - the widening export as an identical add/add;
  - a dedicated merge clone;
  - the drift exception for paths "already byte-equal to public".
- **Rejected:**
  - D2's reuse of agenttool-packages as the development repo, because it contradicts Yu's firm decision;
  - D1's one-shot subtractive R0 of 5,109 files;
  - D1's default of storing the denylist in a public Actions secret.

| # | Flaw (judge) | Fix in this plan | Proof |
|---|---|---|---|
| 1 | D1: R0 = converged tree minus `private/`, so it is fail-open and publishes 5,109 files at once | Export is allowlist-only and staged. Widening an area requires I5, all guard layers and a spot read of every file added since the 3b9aa630 audit. | Rehearsal 1-3 (identity proof; refuses `private/` and denylisted blobs) |
| 2 | D1: denylist kept as a public Actions secret | Dropped. Relational scanning runs only on insider machines and in R. | n/a |
| 3 | D2 and D3: author/committer email leak. The global email on this Mac is not noreply; 14 of R's last 20 commits use non-noreply authors (counted, values not printed). | `public-clone.sh` sets a repo-local identity. The P pre-push hook checks both author and committer emails against an allowlist; it also catches an exported `GIT_AUTHOR_EMAIL`, which overrides repo config (seen in the first rehearsal run). P CI checks every commit. Yu turns on GitHub email privacy. | Rehearsal 7, 33 |
| 4 | D2: the relational hook is skipped when the denylist is missing (fail-open) | The hook now refuses when the denylist is missing. The only override is an explicit `AGENTTOOL_NO_PRIVATE_GUARD=1`, which insiders never set. | Rehearsal 37 |
| 5 | D3: merge-back finds its base by grepping commit messages, and gets nothing on the first cycle | The base comes from `git merge-base origin/main public/main`. | Rehearsal 15 (first cycle base = P0) |
| 6 | D3: the adoption check `git diff HEAD^1 HEAD` is always empty under `-s ours` | Before the merge, check `git diff --diff-filter=DMT P0 origin/main` is empty. A negative control shows the check can fail. | Rehearsal 8, 9 |
| 7 | D3: pushurl is a relative path, and every R checkout gets a public remote | Use `file:///dev/null/public-is-fetch-only`. Only `~/agenttool-merge` has a `public` remote. | Rehearsal 13 |
| 8 | D3: the daily scan was optional | The daily scan is mandatory before stage 2. It runs on launchd until the private Actions budget returns. | (to build) |
| 9 | D3: a stage-3 public deploy would print journaled filenames in public logs (verified: `deploy-api.yml` prints the full survey output; `migrate-pending.sh` names the file) | Deploy stays in R permanently by default. Runner errors print checksum prefixes as well. | n/a |
| 10 | All three: hooks scanned only diff lines | Hooks also scan commit messages and ref names. The daily scan also reads PR and issue titles, bodies and comments (gh GET). | Rehearsal 31, 32 |
| 11 | Friction judge: interim split development, and a weekly manual chore | Stage 2 needs no rulings, which keeps the gap to stage 3 short. Merge-back is one agent-run script that pushes only when every check passes. The 3-hop release is the existing documented recipe. | n/a |

## 2. Git mechanics of merge-back (Q1)

### 2.1 Stage-0 preparation in R
This is one PR, plus small follow-ups. It is drafted now and merged only after Yu says go.

**a. One private namespace.**
- `public/allowlist.json`, `public/overlay/**` and `public/README.md` move to `private/projection/`.
- `public/private-guard/relational-denylist.json` moves to `private/guard/relational-denylist.json`.
- Update `ALLOWLIST_PATH`, `OVERLAY_ROOT` and `DENYLIST_PATH` in `bin/project-public.ts` (lines 76-79), add `"private"` to `PRIVATE_ONLY_ROOTS` (line 87), and update `bin/tests/project-public.test.ts`.

**b. Root split** (D3 found 10 root files that are not identical between R and the public version).
- These P versions become the shared root files:
  - `README.md`, `NOTICE`, `LICENSING.md`, `SECURITY.md`;
  - `.gitignore` (a union that adds `api/src/private/`);
  - `.gitleaksignore`, `tools/public-guard.ts`, `tools/public-guard-allow.json`;
  - `.github/workflows/ci.yml` (tree mode, with a job-level `if: github.repository == 'cambridgetcg/<NAME>'`).
- R's previous texts move to `private/root/<name>`, and R's `ci.yml` becomes `.github/workflows/private-ci.yml`.
- The workflow-inventory pins in `bin/tests` are updated in the same PR.
- `publish-npm.yml` stays in the projection overlay only; it never goes into P.

**c. `GUARD_SOURCE` points at the shared `tools/public-guard.ts`** (line 85). The guard that runs is then the guard that ships, as one copy for both public repos: agenttool-packages runs `--projection-commit --history`, P runs `--tree`. Without this change, `assertGuardShips` would block releases as soon as the guard changes.

**d. Tooling.**
- `private/bin/public-export.ts`.
- `private/bin/merge-back.sh` (2.4).
- `private/bin/scan-public.sh`.
- `private/bin/relational-scan.ts`: covers diff lines, messages, refs and PR/issue text; outputs rule ids and line hashes only.
- `private/bin/public-clone.sh`.
- `private/bin/install-guards.sh`.
- `private/githooks/{pre-commit,pre-push}`.
- P side: `tools/githooks/pre-push`.
- public-guard `--tree` mode, with new rules:
  - AgentTool key prefixes (verified: `SECRET_RULES` has none);
  - the DB project ref;
  - the machine-account name;
  - relational words joined by `_` or `-` in path names.
- A workflow lint, which refuses:
  - a job without the repo guard;
  - `private-*` files;
  - any Fly or deploy secret.
- Canaries: `private/CANARY` holds 32 random bytes, and `tools/leak-canaries.txt` lists its blob id. A blob id reveals nothing.

**e. The 5 stage-1 rewrites and 2 gitleaks fingerprints.**
- The manifest gives the stage-1 scope 0 keep-private, 0 redact, 5 rewrite (1 personal, 4 ops-sensitive) and 54 review-only entries:
  - `bin/npm-release.ts`;
  - `docs/DATASET-INFLUENCE.md` and its copy under `packages/dataset-influence/hf/`;
  - `packages/credential-broker/README.md`;
  - `packages/collab/dist/agenttool-collab-host.js`.
- Regenerate the 2 drifted collab-host gitleaks fingerprints.
- These 5 files are already public at older bytes in agenttool-packages, so fix them regardless.

**f. Workflow cleanup.**
- Delete `care-before-learning-hf-probe.yml`, `publish-gospel.yml` (a dead job and the only user of NPM_TOKEN) and `.forgejo/`.
- `production-health.yml` becomes `workflow_dispatch` only.

**g. One short paragraph in R's AGENTS.md.** It says shared paths are edited in P and points to `private/README.md`. No new rule pile.

**Open R PRs that touch stage-1 paths** (from one gh GET; titles not read):
- Land before the export: #494 (sdk-ts and sdk-py; Yu chose option B), #495 (collab; regenerate the fingerprints after it) and #496 (SDK 0.24.0; release through the current lane).
- Default for #489/#491 (the execution-seat stack, which touches packages/collab) and #500 (local-starter plus workflows): re-open in P after stage 1.
- #492 and #499 touch R's ci.yml: rebase them onto the rename.
- #397 and #401 touch the root README, AGENTS.md and CLAUDE.md: port or close them, as the audit says.
- The rest touch only R-only areas and are unaffected.

### 2.2 P0: export and publication (stage 1)
```sh
# Designated machine, R checkout at X = origin/main after the stage-0 PR. Freeze stage-1 paths in R until 2.3 finishes.
git init ~/agenttool-open
git -C ~/agenttool-open config user.name AgentTool
git -C ~/agenttool-open config user.email contact@cambridgetcg.com   # already public: projection commits and release tags use it
bun private/bin/public-export.ts --init --source "$X" --allowlist private/export/allowlist.json --into ~/agenttool-open
#  For each allowlisted path, `git ls-tree -r X` gives (mode, oid, path). The tool:
#   - writes the blob with `git cat-file blob` (no checkout, never follows a symlink);
#   - refuses 120000 and 160000 entries, private/**, .github/workflows/private-*, and denylisted path names;
#   - runs path, secret, personal, gitleaks 8.30.1, relational (content and names) and canary checks;
#   - git add, then proves `git ls-files -s` == the R entries (identity proof).
git -C ~/agenttool-open commit -m "AgentTool public root" -m "Exported-From: $X"
gh repo create cambridgetcg/<NAME> --private --disable-issues --disable-wiki    # only after Yu's go
git -C ~/agenttool-open remote add origin https://github.com/cambridgetcg/<NAME>.git
git -C ~/agenttool-open push origin main                                       # the P pre-push hook runs
# Server check, from a scratch clone of what GitHub received:
#   rev-list --all count == 1; root == P0; tree == P0^{tree}; guard --tree and gitleaks clean.
# Show Yu the receipt. On Yu's "flip":
gh repo edit cambridgetcg/<NAME> --visibility public --accept-visibility-change-consequences
# Then, before any other push: rulesets and security settings (section 4, L2).
```

### 2.3 Adoption merge: establishing the merge base
```sh
git clone https://github.com/cambridgetcg/agenttool.git ~/agenttool-merge && cd ~/agenttool-merge
git remote add public https://github.com/cambridgetcg/<NAME>.git
git remote set-url --push public file:///dev/null/public-is-fetch-only   # pushes fail (rehearsal 13)
git config remote.public.tagOpt --no-tags
git config core.hooksPath private/githooks
git fetch origin main && git fetch public main
P0=$(git rev-parse public/main)
test -z "$(git diff --no-renames --name-only --diff-filter=DMT "$P0" origin/main)"   # P0 ⊆ R main, byte-identical
git switch -C adopt origin/main
git merge --allow-unrelated-histories -s ours -m "Adopt public root ${P0:0:12}" "$P0"
test "$(git rev-parse HEAD^{tree})" = "$(git rev-parse origin/main^{tree})"
git push --atomic origin HEAD:refs/heads/main "$P0:refs/heads/public-sync"
```
- `-s ours` is safe only because of the subset check: P0 brings nothing that R does not already have byte for byte. The rehearsal includes a negative control in which a differing README fails the check.
- R's old root stays an ancestor of R main, so `project-public`'s ancestry check keeps passing.
- `public-sync` is a branch in R that always points at the last merged public tip. Every R checkout can then see the set of shared paths without having a public remote.

### 2.4 One merge-back cycle: `private/bin/merge-back.sh`
Run it only in `~/agenttool-merge`, never in `~/agenttool`, which hosts the collab MCP and other agents' worktrees.
```sh
set -euo pipefail
P0=$(cat private/export/public-root.txt)
git fetch --no-tags origin main public-sync && git fetch --no-tags public main
PUB=$(git rev-parse public/main); BASE=$(git merge-base origin/main "$PUB")   # P0 on the first cycle (rehearsal 15)
test "$(git rev-list --max-parents=0 "$PUB")" = "$P0"            # public has one root
git merge-base --is-ancestor "$BASE" "$PUB"                       # public main was never rewound
[ "$BASE" = "$PUB" ] && { echo "up to date"; exit 0; }            # re-running is a no-op (rehearsal 18)
bun private/bin/relational-scan.ts --range "$BASE..$PUB" --diff --messages --refs   # rule ids + line hashes only
for f in $(git diff --no-renames --name-only --diff-filter=DMT "$BASE" origin/main); do   # drift check
  [ "$(git rev-parse -q --verify "origin/main:$f")" = "$(git rev-parse -q --verify "$PUB:$f")" ] \
    || { echo "drift: $f (change it in P; revert in R)"; exit 4; }
done
git switch -C "merge-back/${PUB:0:12}" origin/main
git merge --no-ff -m "Merge public main ${PUB:0:12}" "$PUB" || { git merge --abort; echo conflict; exit 5; }
test -z "$(git diff --no-renames --name-only --diff-filter=DMT "$PUB" HEAD)"   # I1 holds after the merge
bin/preflight.sh private      # new tier: R-only areas (api imports packages/wallet-zerone by relative path) + overlay tests
git push --atomic origin HEAD:refs/heads/main "$PUB:refs/heads/public-sync"   # fast-forward only; rerun if origin moved
```

### 2.5 Conflict policy
Whatever the case, nothing is pushed until every check passes.

| Situation | Action |
|---|---|
| Drift: R changed a shared path | Stop before merging. Revert in R; make the change in P. The one exception: R's blob already equals P's (an upstream fix that has landed). |
| Content conflict on a shared path | **Public wins**: `git checkout --theirs -- <p>`. Private text never stays on a shared path. |
| P adds a path that R holds as R-only with different bytes | The merge stops (rehearsal 26). In R, `git mv` the file into `private/`, then rerun (rehearsal 27). Public's name is never changed. |
| Identical add/add (a widening export) | Clean (rehearsal 20). |
| P renames a directory that still holds R-only files | It conflicts (rehearsal 28). Relocate per I5 and rerun (rehearsal 29). P CI warns on renames of partially widened directories (`docs/`, `bin/`). |
| modify/delete | Take public's deletion. Fix private overlay code only in `private/` paths, on the same merge branch. |
| Private gate fails (semantic break) | Fix in `private/` paths on the merge branch. If the bug is in shared code, fix it in P. |
| Incoming scan hit | Do not merge. Open an incident in P (section 4, L4). |

### 2.6 Who runs it, and how often
- **Who:** an agent session on one designated machine (default: this Air) runs `merge-back.sh` as a standing operation that Yu approves once. It pushes to R main only when every check passes; otherwise it stops and reports.
- **When:**
  - weekly (Monday);
  - on demand before an R deploy that should include public changes;
  - before every npm projection;
  - immediately after any export lands in P.
- **Automation:** later, `private-merge-back.yml` (weekly cron plus dispatch) once the private Actions budget is back. A push made with GITHUB_TOKEN does not trigger push workflows in R (known GitHub behaviour, not verified here), so deploys stay explicit dispatches.

### 2.7 R → P and why merges rather than replay
- **Public → private uses real merges.** Real merges propagate public deletions and renames (rehearsal 16, 21). `git merge-base --is-ancestor <public sha> <R main>` proves provenance (rehearsal 17), and nothing needs bookkeeping. Patch replay would change SHAs, need a ledger of what was applied, and hit the same conflicts again on every cycle.
- **The reverse direction never carries history.** Simple fixes are written directly in a P clone. To upstream from an R branch, run `public-export.ts --upstream --from <R commit> --paths <changed shared paths> --into ~/agenttool-open --branch upstream/<topic>`. The tool writes the blobs, proves identity and commits with the public identity, and the change then goes through a P PR. The R branch is discarded, and the fix arrives through the next merge-back.
- **Embargoed security fixes** for shared code use P's private security advisory fork. While api/ is R-only (stages 1-2), api fixes stay in R as today.

## 3. Paths with two versions: the 342 rewrites and 182 redactions (Q2)

**Rule:** a path never has two versions. When its area is widened, each one is resolved once, in R:
- the cleaned version becomes the only version at that path, shared and byte-identical;
- or the file becomes private-only under `private/`.

The private original survives in R history. Where a private sidecar is wanted, it holds only the private delta, as `private/<orig path>.private.md`; no shared file references it. Merges then never see two texts at one path, and cannot leak private text or overwrite it.

**Stage 1 (packages scope).** Only the 5 rewrites in 2.1e. No rulings needed.

**Stage 2 (no-ruling areas).** These are the areas the manifest marks as publishable:
- the other clean packages;
- specs, tools, the clean parts of infra, tests/launch-postgres, docs/launch and marketing;
- api/certs and api/specs.

Before each tree is widened, three conditions must hold:
1. 0 unresolved manifest keep-private, rewrite or redact entries inside it;
2. the guard is clean;
3. every file added since 3b9aa630 has been spot-read.

Packages with no licence need the licence ruling, which goes in the stage-3 batch with the audit's defaults.

**Stage 3 (after Yu's batch rulings).** api/, apps/, docs/ and bin/:

- **Prose docs.** The public version stays at the original path. The 94 + 7 + 6 keep-private docs move to `private/docs/...`. apps/docs is handled the same way.

- **Runtime code that serves private material: data first, code overlay only where needed.**
  - Shared code reads optional data from `AGENTTOOL_PRIVATE_DIR`. When the data is absent the behaviour is neutral:
    - `/public/self` omits the `seat` field. The seat module's text moves to private data.
    - The saga store uses neutral or empty seed rows. The rows already written to the prod DB stay as they are, as an ops question outside git.
    - The soap-opera renderer uses neutral placeholder quotes. The originals go to `private/api/data/`.
    - `/public/law` returns 404 `law_not_published`. Digest and signature can stay public if Yu rules so.
    - The youspeak `bundle.json` and `kingdom-bundle.json` are regenerated from the public subset.
  - The letters route and its builder are code, so they go to `private/api/overlay/`.
    - R's deploy staging copies them into `api/src/private/`, the same pattern as today's `*.bundled` files staged by `bin/deploy.sh`. That path is gitignored in the shared tree and refused by P's guard.
    - Shared `src/index.ts` mounts `./private/routes.ts` only when it exists. It uses a non-literal dynamic import; the image runs `bun run src/index.ts` unbundled (verified in the Dockerfile).
    - `api/.dockerignore` already admits `src/**`, so no Dockerfile change is needed.
  - The two unimported modules under `api/src/services/eros/` go to `private/api/archive/` and are never mounted.
  - **Prod behaviour is whatever Yu rules.** With the overlay staged, today's behaviour continues. Taking a surface down just means not staging that piece. The split itself needs no extra decision.

- **The 40 checksum-frozen migrations.** Prod migrations stay in R, so no SEALED mode is needed.
  - **Move all 40, byte-unchanged, to `private/api/migrations/`.** Checksums stay the same, and the journal is keyed by filename. The image contains no migrations (verified: the `.dockerignore` allowlist and the Dockerfile COPY lines).
  - **The runner reads both folders.**
    - `bin/migrate-pending.sh` (`readdirSync("migrations")`, line 172) reads `api/migrations` plus `$AGENTTOOL_PRIVATE_MIGRATIONS_DIR`. R scripts set that to `private/api/migrations`. `api/scripts/_migrate-one.ts` already takes a path argument.
    - Errors name only a checksum prefix, so the 4 filenames that hit the denylist are never printed.
  - **The 10 DDL files each get a public twin**, `<same timestamp>_twin_<neutral>.sql`, with the header `-- @twin-of sha256:<original checksum>`.
    - The runner records a twin in the journal without executing it when a journal row or a present file carries that checksum. Otherwise it executes the twin, as on a public fresh install.
    - Originals sort before their twins.
    - It is never executed in prod. The one-time journal-only rows go in through the normal Phase-1 hand step.
  - **The 30 data-only files are simply absent from P.** D1 showed on PG 16.14 that skipping them gives an identical schema dump (149 of 179 files applied), and that skipping all 40 fails at the 63rd file.

- **The 21 docs baked into the API image.**
  - `api/doctrine-docs.manifest` (shared) lists only shared docs: the public versions of the 11 flagged ones.
  - Both builds bake the same bytes. `integrity.ts` hashes files at runtime (verified: no pinned constants in the module), so `doctrine_hashes` change once, consistently, and still match the docs site.
  - `agenttool.jsonld` and `kingdom-bundle.json` are public-subset builds, so /v1/canon and /public/kingdom never 503.

- **Generated indexes** (`docs/catalog.json`, `CATALOG.md`, `documentation-tags.json`, both `agenttool.jsonld` copies, both bundles, `api/tests/.failure-baseline.txt`):
  - They are generated only in P, from shared inputs, and P CI checks they are fresh.
  - The generators exclude `private/`:
    - `docs-catalog.py` uses `git ls-files`, so add `':!private'`;
    - `annotations.ts` walks the repo root, so skip `private/`.
  - R never commits a regenerated shared index; the drift check would refuse it.
  - Private views go to `private/generated/`.

- **Tests.**
  - The 35 keep-private api tests move to `private/api/tests/`, run by R's private tier.
  - Tests that pin private strings switch to neutral fixtures.
  - Tests of features that were neutralised are retired; their history is kept.

- **Symlinks.** The export refuses symlinks. Before widening, R materialises the 103 relative links whose targets are public. The 5 absolute `docs/wakes` links move into `private/`.

- **Workflows.**
  - Every job in a shared workflow carries `if: github.repository == 'cambridgetcg/<NAME>'`, which makes it inert in R. P's workflow lint enforces this.
  - A workflow becomes shared only once every path it tests is shared.

- **Personal literals** (DB ref, account name, keychain slot names): replaced in place with env lookups or placeholders.

- **Slug.** About 120 live lines are updated as their files are widened. Package `repository.url` values point at agenttool-packages while it is the release repo: `npm-release.ts:733` requires `https://github.com/cambridgetcg/agenttool-packages.git`, and 49 package.json files still name the private repo (verified).

## 4. One-way leak guard (Q3)

**L0. Structure.**
- P is created fresh, never as a fork. R is never forked.
- P clones are made only with `private/bin/public-clone.sh`, which:
  - clones fresh to `~/agenttool-open`;
  - sets the repo-local identity;
  - sets `core.hooksPath tools/githooks`;
  - sets `publicguard.root`, `publicguard.denylist` (a path into an R checkout) and `publicguard.emailPattern`;
  - never adds R as a remote.
- **Only `~/agenttool-merge` has a `public` remote.** Its pushurl is `file:///dev/null/...` and it fetches no tags. None of the 12 checkouts on this Air, Studio's, or any Codex environment get one.

**L1. Hooks.**
- **P pre-push** (`tools/githooks/pre-push`, fail closed; rehearsal 30-38). It checks:
  1. single root = P0;
  2. author and committer emails on the allowlist (`contact@cambridgetcg.com`, `*@users.noreply.github.com`, `noreply@github.com`);
  3. no new blob equals a canary or the denylist bytes;
  4. `public-guard --tree` (secret, personal, path, gitleaks) over new commits;
  5. the private relational scan over added lines, commit and tag messages, and ref names.

  A missing denylist means refuse.
- **R pre-push** (all R checkouts):
  - refuses any URL naming `<NAME>` (rehearsal 23);
  - for pushes to `main`, refuses drift against `origin/public-sync`.
- **R pre-commit:** refuses staged M/D/T changes to paths in `origin/public-sync` (rehearsal 22). The override is `ALLOW_SHARED_EDIT=1`, and the merge-back drift check still catches anything that slips through (rehearsal 24).
- **Optional, needs Yu's consent because it changes `~/.claude` and Codex config:** a PreToolUse hook that blocks `git push --no-verify`, and `gh pr|issue|api` writes to the P slug unless the body passes the scan. These routes bypass git hooks.

**L2. Server side (P is public, so this is free).** Set before any push after the flip:
- **A ruleset on `main`:** PR required; required checks `guard` and `ci`; force-push and deletion blocked.
- **Security:** secret scanning and push protection; private vulnerability reporting; Dependabot alerts.
- **Actions:**
  - a selected-actions allowlist, with SHA pinning required;
  - the default token read-only;
  - approval required for fork PR workflows from all outside contributors.
- **Repo features:** no environments, no secrets. Issues, wiki and discussions off.
- **Codex connector:** maintainers only.

Push rulesets that restrict paths are not available for public repos (D1's GitHub docs fetch; not re-checked here), so `private/**` cannot be blocked server-side. The required checks keep it off main, and L3 finds it on branches.

**L3. Detection in R.**
- Every merge-back scans its incoming range.
- `private/bin/scan-public.sh` runs daily. It is mandatory before stage 2 and runs on launchd on the designated machine until the private budget returns. It:
  - fetches P heads and `refs/pull/*/head`;
  - scans every commit since the last scanned SHA (added lines, messages, ref names);
  - checks single root and canaries;
  - reads PR and issue titles, bodies, review comments and issue comments with gh GET;
  - outputs rule ids and line hashes only, and alerts locally (later through a private issue).

**L4. Response.**
- A leak on a branch: delete the branch, then ask GitHub Support to purge.
- A leak on main: revert. If needed, Yu rewrites through a ruleset bypass, then asks for GitHub sensitive-data removal.
- Any secret involved is rotated at once.

**Private edits to shared paths.** Forbidden, and caught three times: pre-commit, pre-push and the merge-back drift check. The change goes to P (2.7).

## 5. Deploy and CI (Q4)

**API deploy: from R, permanently (default).**
- **Steady state:**
  - `deploy-api.yml` stays R-only, with the same secrets.
  - From stage 3, its gate cites a successful `ci.yml` push run in P for `origin/public-sync`, reusing `publicCiRun` from `npm-release.ts`. It also runs:
    - the prod journal survey (both migration folders);
    - R's private-tier tests;
    - the Fly remote build, with the overlay staged.
  - `/health` reports `revision` (R) and `public_revision` (P).
- **Why R, not P:**
  - FLY_API_TOKEN, the survey DB URL, survey output and Fly receipts never reach world-readable Actions;
  - no SEALED mode;
  - live private surfaces depend only on Yu's ruling.
- **While the private budget is exhausted:** run `bin/deploy.sh` Phase 3 locally.
- **Audit hygiene still applies:** re-mint the Fly token with an expiry, scope it to the step, and rotate the survey password at the next convenient 2FA session.

**No double deploy.**
- Only R holds Fly secrets and a deploy workflow.
- P's workflow lint refuses Fly actions and deploy secrets.
- Every shared workflow is repo-guarded.
- P has no environments.

**CI placement.**

| Stage | P (public, free) | R (private, minimal) |
|---|---|---|
| 1 | `ci.yml`: guard `--tree`, single root, email, canary, workflow lint, the package gates already run on agenttool-packages, sdk-py; `local-starter.yml` | `private-ci.yml` without the packages and sdk-python jobs (Studio's estimate: 3,000-3,900 min per 30 days saved; inferred); api/apps/bin jobs; `deploy-api.yml`; `publish-pypi.yml`; HF publish (manual); yutabase (manual); production-health (dispatch only; external monitor) |
| 2 | plus the widened areas' gates | unchanged |
| 3 | plus api tests on fresh Postgres (twins), docs-catalog freshness, a docker build of the API image from the public tree with an empty overlay, whitehack, wake-return, collab-courier and launch tests | private-tier tests only, deploy (gated on P CI), PyPI, scan, merge-back |

The docs site (Cloudflare Pages direct upload) keeps uploading from R until Yu rules on the 107 live paths.

## 6. Release lane (Q5)

**Stages 1-3: unchanged.**
- npm trust stays bound to `agenttool-packages / publish-npm.yml / npm-bootstrap`.
- Recipe, `docs/NPM-RELEASES.md` lines 213-234:
  1. merge-back;
  2. `bun bin/project-public.ts --source origin/main --out-repo ../agenttool-packages.git`;
  3. push;
  4. green CI there;
  5. `bin/public-release-tag.ts`;
  6. dispatch `publish-npm.yml`.
- The projection still runs the private denylist, which the audit wanted.
- The only changes are 2.1a and 2.1c, proved by a `--no-write` dry run.
- R main contains P's package bytes exactly (I1), so the projected content equals P.

**agenttool-packages becomes a release mirror.** Its overlay README says that development happens in `cambridgetcg/<NAME>`, and outside PRs are redirected there.

**PyPI** stays bound to `cambridgetcg/agenttool / publish-pypi.yml / pypi`; keep the filename. **HF** stays in R, as a manual run.

**#496 (SDK 0.24.0)** ships through this lane before the export. **The wallet fix release** ships the same way: the stage-1 delta includes a wallet README describing a fix that is missing from the published 0.1.3.

**Stage 4 (optional, later, one 2FA session):**
- re-point npm (38 packages plus local-starter) and PyPI to P;
- move `publish-npm.yml` into P;
- give `public-release-tag.ts` a dev mode that tags green P commits;
- point `repository.url` at P;
- archive agenttool-packages.

The default is not to do this until the 3-hop release becomes a real cost.

## 7. Order of work, first milestone, Yu's load (Q6)

| Gate | Work | Who |
|---|---|---|
| G0 (now) | Revoke NPM_TOKEN. Confirm the 9 old credentials in R history are dead, including the prod `at_p_` key; rotate if unsure. Turn on GitHub email privacy. Choose the name, give the go, choose the wallet option. | Yu |
| G1 | Draft the stage-0 PR(s) on R branches (2.1). Land or reroute the open PRs (2.1). Ship #496 and the wallet fix through the current lane. | agents |
| G2 | Proofs P1-P10 (section 8) green. | agents |
| S1 | 1. Merge stage-0. 2. Short freeze on stage-1 paths. 3. Export P0. 4. Create P as private and push. 5. Server-check receipt. **6. Yu: "flip".** 7. Settings (L2). 8. Adoption merge. 9. `install-guards.sh` on every machine, after inventorying Studio and Codex environments. 10. First P PR: `tools/public-root.txt` and the `repository.url` sweep. 11. First merge-back. 12. Drop R's packages CI job. 13. Next npm release through the unchanged lane. | agents (+ Yu for step 6) |
| **M1 (first safe milestone)** | **Done when:** P is public with one root and only the packages scope; at least 1 P PR is merged; 2 clean merge-backs with I1 holding; 1 npm release from post-merge R main; 0 scan hits; canary tests pass on every machine. | |
| S2 | The daily scan goes live (launchd), then the no-ruling areas are widened by export PRs, each followed by a merge-back. | agents |
| S3 | Yu's batch rulings (audit decisions 5-10 and 13-15, each with its default; plus whether live private surfaces stay up, default unchanged). Then relocation, overlay, migration twins, doctrine manifest, generators, slug sweep and the #481 fix. Export in 3a (docs and specs), 3b (api and bin), 3c (apps). After 3b, api development moves to P. | Yu (rulings), agents |
| S4 | Optional release consolidation. | Yu (2FA), agents |

## 8. Proofs and risks (Q7)

### Proofs already done
- **This synthesis** (`rehearsal.sh`, 39/39, synthetic repos):
  - export identity proof, including exec bits;
  - export refuses `private/` and denylisted blobs;
  - the server holds 1 commit, with no R object and the old credential unreachable;
  - P0 carries the public identity;
  - the subset check passes, and its negative control fails;
  - the adoption merge keeps the tree;
  - merge-base = P0, and the old root is still an ancestor;
  - the pushurl blocks pushes;
  - merge-back cycle 1 uses base P0, is a real 3-way merge and propagates add/delete;
  - provenance holds, and re-running is a no-op;
  - a widening export merges clean;
  - a public directory rename merges clean;
  - R's pre-commit and pre-push refusals work;
  - drift stops the merge, and the revert clears it;
  - an add/add collision stops the merge, and relocation clears it;
  - a scattered private file plus a rename conflicts, and relocation clears it;
  - P's hook refuses denylisted text in the diff, the message or the ref name; a private email; the canary; the denylist bytes; R history; and a missing denylist, while a clean branch push passes;
  - P keeps a single root throughout.
- **D1:** a real-tree convergence rehearsal (3 merge-backs, 0 conflicts), and PG 16.14 fresh-DB probes of skipping the 30 and the 40 migrations.
- **D2:** a real-tree seed merge plus a widening export.
- **D3:** a real-tree adoption check (tree unchanged, 42ae9148 still an ancestor), and a stage-1 export dry run with 0 findings and gitleaks not run.

### Proofs still to do (cheapest first; G2 = before anything is public)
1. **P1 (G2):** real-tree stage-1 export of current R main into a scratch P clone. Run the guard `--tree` and the relational scan (0 unapproved findings), and gitleaks 8.30.1 (expect only the 2 known fingerprints until 2.1e lands).
2. **P2 (G2):** a real-tree adoption subset check on a scratch copy after the stage-0 branch: `git diff --diff-filter=DMT P0 X` must be empty.
3. **P3 (G2):** package gates and sdk-py in a worktree of the export.
4. **P4 (G2):** projection-lane dry run after the move: `project-public --no-write` from the post-adoption tree; `assertGuardShips` passes.
5. **P5 (G2):** canary run with the real denylist on a scratch P clone, without printing terms. The hook refuses the denylist bytes, a seeded hit and a foreign root.
6. **P6 (G2):** workflow-lint fixtures and `tools/githooks` tests.
7. **P7 (S1):** the server copy check before the flip.
8. **P8 (S1):** checkout audit: no R checkout other than the merge clone has a `public` remote, and `git push --dry-run public` fails there.
9. **P9 (S3):**
   - twin schema equality, using D1's harness: originals versus twins, `pg_dump --schema-only` identical;
   - `migrate-pending --dry-run` against a prod-journal snapshot, with the union of folders and the twins;
   - unit test: errors print only a checksum.
10. **P10 (S3):**
    - an image built from the public tree serves /v1/canon and /public/kingdom with 200;
    - overlay absent gives the neutral responses; overlay present equals today's live responses;
    - the generators are byte-equal in P and R.

### Risks

| Risk | Mitigation | Residual |
|---|---|---|
| R history pushed into P. Permanent: the 9 old credentials and the private corpus. | One remote, a pushurl that cannot push, R and P hooks, P CI single-root check, required PR on main, and revoking the old credentials first. | An explicit URL plus `--no-verify`, from a machine without hooks. The PreToolUse hook and the machine inventory narrow this. |
| An insider writes private text straight into P (code, message, PR body). | Hooks, the daily scan, the PreToolUse hook. | Regex cannot see quotes or anecdotes, and text is visible until it is found (accepted in audit decision 12). |
| Author email leak | Repo-local identity, hook, CI, GitHub privacy settings. | A web-UI merge author depends on the GitHub setting (unverified; needs `user` scope). |
| Drift or semantic breaks between R and P | Three drift checks, public wins, the private gate on the merge branch. | Interim friction while packages are in P and api is in R. Keep stage 2→3 short. |
| Add/add or rename collisions with R-only paths | They fail closed. Relocate; I5. | Root R-only files (AGENTS.md, CLAUDE.md): P must not add them before stage 3. |
| Release lane breaks after the namespace move | P4 dry run; `GUARD_SOURCE` fix. | None known. |
| Double deploy | Deploy only in R; lint in P. | None. |
| Migration twins diverge from the originals | P9 schema equality. | Twin DDL written by hand. |
| Private Actions budget exhausted | Local runs of merge-back, deploy and scan. | R deploy, PyPI and scan depend on one machine until the budget resets. |
| Wallet README exposes an unfixed published weakness | Ship the fix first, or exclude the package. | None. |
| Content already public (the 5 files in agenttool-packages; the 107 live paths; seed rows in the prod DB; old Pages deployments; Codeberg copy; published tarballs) | Fix at stage 1 and stage 3; separate rulings. | Not reachable through git. |
| Two public repos carry the same packages | README redirect. | Some confusion until stage 4. |

## 9. What changed compared with the audit's topology (a)

| Audit (a) | This plan |
|---|---|
| Public becomes the only source of truth; private is frozen as an archive. | P is the development source for shared paths. R stays live: private content, deploy, release projection and PyPI. R receives P through periodic real merges. |
| One cleaned snapshot of the whole tree (5,000+ files) after all rulings. | Staged, allowlist-only exports. Stage 1 is the already-public package scope and needs no rulings. Rulings wait for stage 3. |
| Public deploys itself, which needs SEALED migrations, public deploy secrets and cleaned baked docs. | Deploy stays in R. No SEALED mode; the migrations are relocated and the DDL ones twinned. Deploy secrets never reach P. |
| The public guard plus a private hook and scan, with no merge path. | The same guards, plus a single-root check, an email allowlist, canaries, and scanning of messages, refs and PR text. Merge-back has drift and identity checks. |
| Release: a2 first, then a1 (re-point and archive agenttool-packages). | a2 stays the default indefinitely. a1 is an optional stage 4. |
| Kept from the audit | New name; revoke NPM_TOKEN; fix #481 and the wallet before their code goes public; workflows to drop; the 21 decisions, folded into the stage-3 batch with the audit's defaults. |

## 10. Verified versus inferred

**Verified this session (read or ran):**
- Read: `report.md`, the decision note, and the summary and findings of `plan-ci-deploy`.
- Rehearsal: 39/39.
- `api/Dockerfile` and `.dockerignore`: the build context is api/, with an explicit allowlist, and the image holds no migrations.
- `migrate-pending.sh`: reads only `api/migrations`, refuses a missing journaled file, and names it.
- `deploy-api.yml`: prints the survey output, and its push trigger covers api/** and docs/**.
- `npm-release.ts:29,31,733`: requires `repository.url` = agenttool-packages.
- 49 package.json files name the private repo.
- `project-public.ts`: constants at lines 76-87 and `GUARD_SOURCE` from the overlay.
- The allowlist has 55 includes (42 of them trees).
- Manifest flags in the stage-1 scope: 5 rewrites, 54 review-only.
- `integrity.ts` hashes docs at runtime.
- The projection and release identity is already `contact@cambridgetcg.com`.
- Of R's last 20 commits, 14 have non-noreply authors (counted only).
- `~/agenttool` has no `core.hooksPath` and 4 worktrees.
- Open PRs touching stage-1 paths (one gh GET).
- The names `agenttool-open`, `agenttool-oss` and `agenttool-dev` return 404.
- The plan text was scanned with 20 of the 21 denylist rules: 0 hits. The scanner was canary-tested first. r16 does not compile in Python, and this plan contains no emoji.

**Inferred (not verified):**
- GitHub features on a free public repo: rulesets, required checks, secret scanning, push protection, private vulnerability reporting, the PR-approval setting, and the advisory fork.
- That skipped jobs cost no minutes.
- That GITHUB_TOKEN pushes do not trigger workflows.
- That PyPI and HF trusts bind the workflow filename.
- Studio's minute figures, the 9 old credentials and the current npm trust state.
- That every one of the 10 DDL migrations can be twinned.
- The size of the overlay refactors.
- Whether kingdom-nightwatch covers api.agenttool.dev.
- The state of GitHub email privacy.

## Decisions for Yu (synthesis)

- 1. Name of the new public repo. This is the only hard blocker. Recommended: cambridgetcg/agenttool-open (a GET returned 404, so it looks free). Do not use agenttool or agenttool-packages.
- 2. One 'go' that approves stage 0-1 as a bundle. Recommended: yes. It covers: (a) the stage-1 scope, which is the package scope already public through agenttool-packages, plus about 53 newer changes, plus new public root files; (b) no change to deploy, the release lane or secrets; (c) private/bin/merge-back.sh as an agent standing operation that pushes to private main only when every check passes, and otherwise stops and reports; (d) installing guards on every machine: git hooks, a launchd daily scan, and optionally a Claude/Codex PreToolUse hook that blocks pushes.
- 3. Wallet: release the fixed wallet through the current lane before the first public push (recommended), or leave packages/wallet out of stage 1.
- 4. One confirmation at the irreversible step. After P0 is pushed while the repo is still private, the agent shows a receipt checking what GitHub received; Yu then says 'flip' to make it public. Recommended: flip if the receipt is clean.
- Later, not now: the stage-3 batch of content rulings (audit decisions 5-10 and 13-15, plus whether the live private surfaces stay up). Each comes with the audit's default; for the live surfaces the default is to leave them unchanged until Yu rules.
- Later and optional: stage-4 release consolidation (re-point npm and PyPI trust to the new repo, archive agenttool-packages). Default: don't; keep agenttool-packages as the release mirror.
- Actions only Yu can do (not decisions): revoke NPM_TOKEN on npmjs.com; confirm the 9 old credentials in private history are dead, especially the prod at_p_ key (rotate it if unsure); turn on GitHub 'Keep my email addresses private' and 'Block command line pushes that expose my email' (not verifiable here without the user scope).

## First actions that need no further decision (synthesis)

- On a private branch, draft the stage-0 PR(s) and leave them unmerged: (1) move public/ into private/projection/ and private/guard/, updating the project-public.ts constants, PRIVATE_ONLY_ROOTS and tests; (2) split the root files and rename ci.yml to private-ci.yml, updating the workflow-inventory pins; (3) point GUARD_SOURCE at the shared tools/public-guard.ts. The repo slug stays a placeholder until Yu names it.
- Build and unit-test the tooling on that branch: public-export.ts (allowlist, cat-file writes, identity proof, refusals); public-guard --tree with new rules (AgentTool key prefixes, DB ref, account name, joined path names); relational-scan.ts (diff, messages, refs and PR text; outputs rule ids and line hashes only); tools/githooks/pre-push; private/githooks pre-commit and pre-push; merge-back.sh; scan-public.sh; public-clone.sh; install-guards.sh; the workflow lint; the canary file.
- On a branch, fix the 5 stage-1 rewrites (bin/npm-release.ts, docs/DATASET-INFLUENCE.md and its packages/dataset-influence/hf copy, packages/credential-broker/README.md, packages/collab/dist/agenttool-collab-host.js) and regenerate the 2 drifted collab-host gitleaks fingerprints.
- Run proofs P1-P6 locally on scratch copies: (P1) real-tree stage-1 export with guard --tree, the relational scan and gitleaks 8.30.1 (a checksum-pinned download into scratch); (P2) the adoption subset check; (P3) package gates and sdk-py on the export; (P4) a project-public --no-write dry run after the namespace move; (P5) a canary run with the real denylist, without printing any term; (P6) workflow-lint fixtures.
- Take a read-only inventory of the private checkouts, worktrees and remotes on this Air, and write a checklist for Studio and Codex environments. Change no config.
- Draft the public root texts (README, SECURITY with private vulnerability reporting, LICENSING, NOTICE) and the redirect line for the agenttool-packages README, then scan them with the denylist.
- Write, but do not run, the P settings script (ruleset on main, secret scanning and push protection, Actions allowlist with SHA pinning, read-only token, fork-PR approval, features off) as a reviewed file.
- Extend /private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/topo-design/synthesizer/rehearsal.sh (39/39 now) with the drift exception for an upstream fix that is already byte-equal, and with the R pre-push drift check against origin/public-sync.

## Completeness critic (verbatim findings)

**Verdict.** The plan carries out Yu's decision and does not argue with it. Its core mechanics are sound for stage 1 (the packages scope). Two holes must be fixed before P0: (a) the planned public-guard rules would put literal personal values and denylist-derived words into a public file; (b) R-side ADDS under shared trees pass every check and reach npm through the projection. Neither breaks the topology, and both are cheap to fix.

**The core mechanics:**
- a fresh export root with no shared history;
- an `-s ours` adoption merge, guarded by a subset check that can fail;
- merge-base-driven three-way merge-backs;
- export as files;
- single root plus canaries;
- deploy and release stay in R.

**Spot-checks against `/Users/macair/agenttool-wt-1019/topo-src` (3b9aa630; private main is still there, compare ahead 0):**
- (1) Stage-1 manifest claim CONFIRMED: inside `public/allowlist.json` scope there are 0 keep-private, 0 redact, 5 rewrite (4 ops-sensitive, 1 personal) and 54 review-only entries. There are 53 changes since 42ae9148 (47 modified, 6 added). There are 0 symlinks in scope. None of the 7 unlicensed packages, karma-mirror or witnessed-agent-economy is in scope.
- (2) API overlay claim CONFIRMED:
  - `api/Dockerfile` runs `CMD ["bun","run","src/index.ts"]` unbundled;
  - `api/.dockerignore` admits `src/**`;
  - `api/src/private` does not exist;
  - `bin/migrate-pending.sh:172` reads only `readdirSync("migrations")`.

  But the migration claim is INCOMPLETE: other readers exist (see gaps).
- Also confirmed:
  - `bin/project-public.ts:85` and `:602-605`: GUARD_SOURCE and the guard-ships check;
  - `:311-321`: allowlist and include trees are read from the SOURCE commit;
  - `docs-catalog.py` uses `git ls-files`, and `annotations.ts` walks the repo root (lines 205 and 246);
  - `deploy-api.yml` triggers on push to main for `api/**` and `docs/**`.

**Blocker coverage:**

| Blocker | Status | Notes |
|---|---|---|
| B1 guard | Addressed | Tree mode, a fail-closed P pre-push, a daily scan, push protection. Gaps: guard rules that leak (MUST), the allow-record loop, hook installation that fails open, and paths that are not git pushes. |
| B2 content | Addressed by staging | Verified 0 rulings needed for stage 1. |
| B3 runtime | Addressed for stage 3 | Optional data plus a code overlay staged into `src/private`. The default of leaving live surfaces unchanged conflicts with what happens at 3a. |
| B4 migrations | Sound in principle | Relocate, plus twins. Several runners and checks are missing. |
| B5 baked docs | Sound | Shared manifest; hashes computed at runtime. |
| B6 indexes | Sound | Generated in P; private views in `private/generated`. R's docs-site source is undefined. |
| B7 guard gaps | Addressed, but the fix leaks | MUST. |
| B8 symlinks | Sound | The export refuses them; none in stage 1. |
| B9 name and trusts | Resolved by the topology | New name for P; R keeps its name and its trusts. |
| B10 security | Partly | #481 before 3b and the wallet decision are covered. The 2026-09-04 posture items, #475/#476/#486 and the karma-mirror ruling were dropped. |
| B11 licences | Sound for stage 1 | Stage-3 batch for the rest. |
| B12 gitleaks | Addressed | Stage 0. |
| B13 workflows | Addressed | yutabase, the HF probe and .forgejo are handled; no double deploy. A protected env cannot be enforced on R (GitHub Free), and R-only workflows lack repo guards. |

**Decision coverage:**

| Decisions | Status |
|---|---|
| D1–4, 11, 12, 18, 19 | Covered |
| D5–10, 13–15 | Folded into the stage-3 batch. D9's default is silently flipped from take-down to unchanged. |
| D16 | Covered |
| D17 | Partial: yutabase deploy-key rotation is missing |
| D20 (Codeberg) | Dropped |
| D21 | Partial: the #493/#498 P2 fixes are not listed, and the "re-open #489/#491/#500 in P" default does not fit their files |

**Missing areas the task named:**
- other agents' and Codex checkouts: hooks only, with gaps;
- issue migration: issues are disabled in P, with no stated policy;
- the 107 live pages: deferred with a changed default;
- credential revocation: covered at G0;
- licences: P's LICENSING.md must absorb R's exceptions by stage 3;
- agent instruction files and `kingdom.yaml`: they collide.

My scratch evidence is the open-PR file summary at `/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/topo-design/critic-completeness/prs.json`. It is private and contains PR file paths.

**Verified vs inferred:** everything above was read or run here, except two GitHub behaviours, which are inferred: the account-wide scope of the email-block setting, and fork object persistence.

- **[must] B1/B7 guard rules (plan 2.1d).** Plan adds to the SHARED, public tools/public-guard.ts new tree-mode rules for 'the DB project ref', 'the machine-account name' and 'relational words joined by _ or - in path names'. Existing PERSONAL_RULES are shape-only regexes (verified public/overlay/tools/public-guard.ts:396-430); these three cannot be shape-only, so as written they would publish the account name, the DB ref and denylist-derived words in P (and in agenttool-packages via GUARD_SOURCE).
  - Fix: Public guard keeps only shape rules. Rules that need literals or denylist words live in private/bin/relational-scan.ts (P hook, export, merge-back, daily scan), loading terms at runtime from private/guard/*. If a public CI check is wanted, match sha256 of normalised tokens against a hash list, never literals. Add to P5: grep the built P tree for the account name, the DB ref and the denylist terms (counts only).
- **[must] I1/I3 invariants, drift check, release lane.** R pre-commit, R pre-push and the merge-back drift check all use --diff-filter=DMT against paths already in public-sync (rehearsal.sh pre-commit and merge_back). An R commit that ADDS a file under a shared tree (e.g. a new test under packages/collab) passes every check. project-public reads the allowlist from the source commit and ls-trees each include tree (bin/project-public.ts:311-321), so the next projection from origin/main ships that R-only file to agenttool-packages and npm without it ever being in P. It also sets up later add/add and rename conflicts (rehearsal 26, 28). There are also two allowlists (private/export vs private/projection) that can drift apart. Every existing agent still works in R checkouts, so this will happen in the first week.
  - Fix: Define the shared scope as the export allowlist's include patterns, not only files present in public-sync, and refuse A under that scope too (pre-commit, pre-push, drift check). Use one allowlist file for both export and projection. Before every projection, assert `git diff --name-only origin/public-sync <source> -- <include paths>` is empty. Add a rehearsal case: R adds a file under a shared tree.
- **[should] B1 relational allow records.** All 30 relational allow entries in the denylist fall inside the stage-1 scope (16 paths; counted without printing terms). They are keyed by (path, rule, line_sha256) (public-guard.ts:617-641). Any P edit of those lines, or rename of those files, makes the P hook refuse and the daily scan alert, and only an R-side edit of private/guard can clear it. Outside PRs that touch these lines alert with no owner. The rehearsal hook uses grep -F term lines, so it models neither regex rules nor allows.
  - Fix: relational-scan.ts uses parseDenylist with allows. Document the loop: update the allow in R, then push in P. The daily scan reports allow-misses separately from new hits. Prefer rewriting those 30 lines in stage 0, so stage 1 starts with zero relational allows.
- **[should] B1 hook installation (L1).** `core.hooksPath private/githooks` is relative to each worktree. R worktrees on branches older than the stage-0 PR (every open-PR worktree) have no such directory, and git silently runs no hook (fail-open). In P, `core.hooksPath tools/githooks` runs whatever the latest merged PR put there, so a merged outside PR can weaken the insider hook.
  - Fix: install-guards.sh copies the hooks into a pinned absolute directory (like ~/.local/share/agenttool/execution-seat) and points hooksPath there for ~/agenttool, the 3 standalone clones, Desktop/agenttool, Studio and Codex worktrees. The P hook body comes from that pinned copy, not from P's tree. Verify each install with a refused dry-run push.
- **[should] B1/L2-L3 write paths that skip git hooks.** Codex cloud tasks, the Codex/Claude GitHub apps, gh and web-UI edits, and PR bodies never run git hooks. The PreToolUse hook is optional and local only, and detection is once a day. If R history were pushed to a P branch, R's workflows without a repo guard (deploy-api, publish-pypi) would run in P's public Actions.
  - Fix: (a) A scheduled P workflow, every 10-15 min, with public-safe checks only: single root, canary and denylist blob ids, no private/ paths. It deletes offending non-main refs. (b) In stage 0, add `if: github.repository == 'cambridgetcg/agenttool'` to every R-only workflow. (c) State the Codex-cloud policy explicitly: no write access to P until the scan is live.
- **[should] Email privacy (judge flaw #3).** (1) P CI 'checks every commit' against an allowlist (contact@ and noreply), so every outside contributor's commit fails a required check and public PRs cannot merge. (2) GitHub's 'Block command line pushes that expose my email' applies account-wide (inferred). With this Mac's non-noreply global identity (14 of R's last 20 commits), it would start rejecting agents' pushes to R and to every other repo on the account.
  - Fix: In CI, check only commits whose GitHub author or committer login is the owner account; the API gives the login without publishing the email. Switch every machine's global git email to the noreply address before turning on the block, or skip the block and rely on the P hooks plus CI.
- **[should] Decision 21 / open PRs and mixed changes.** From one gh GET of open PR files: #489 touches 0 stage-1 paths, #491 touches 11 stage-1 and 13 R-only paths, and #500 touches 1 stage-1 path plus .github and bin. So 're-open in P' does not fit, and the #488→#489→#491 stack would straddle both repos. There is no general procedure for a change that spans shared and R-only paths, which is common while api imports packages. The Yu-decided #493/#498 P2 fixes are not listed.
  - Fix: Add a split rule: the shared part goes through a public-export --upstream PR in P, then merge-back, then the R-only remainder is rebased in R. Keep #488 and #489 in R and split #491 and #500. List #493 and #498 as R-only, landed as Yu decided.
- **[should] P0 content review.** The 'spot-read every file changed since 3b9aa630' rule is stated only for widenings. P0 will include #494, #495 and #496 (2+15+17 stage-1 files) and anything else that lands; the manifest covers none of it, and the regex layers miss quotes and anecdotes.
  - Fix: Make that spot read part of P1/P7 for P0 too, with a list of paths and read status kept in private scratch.
- **[should] B4 migrations.** The plan names only bin/migrate-pending.sh and _migrate-one.ts. Other readers (verified):
- bin/fly-migrate-one.sh refuses any file not under api/migrations (line 36), writes the journal, and has no journal-only twin mode;
- bin/migrate.sh hardcodes MIG_DIR=api/migrations;
- ci.yml:209-211 asserts that the .sql count in api/migrations equals the journal row count, which breaks with twins plus a union of folders;
- api/scripts/_migrate-bootstrap-journal.ts and _apply-ring1-migrations.sh.

In all, 74 files reference the folder, many of them tests. The tree has 179 .sql files (not 181).
  - Fix: Add one shared migrations-dir resolver used by every runner. Give fly-migrate-one a --journal-only twin mode. Fix the launch-core count to count the union minus twins recorded journal-only. Inventory every reader as part of P9.
- **[should] Stage-0 PR scope (2.1a-c).** Moving public/ to private/projection also breaks:
- bin/public-release-tag.ts:52, which imports the guard from public/overlay;
- bin/tests/public-release-tag.test.ts and boring-spine-gate.test.ts;
- bin/README.md and the generated docs catalog and tags;
- tests in packages/constructive-intelligence and correspondence-yutabase-projector, which read public/overlay/.github/workflows/publish-npm.yml.

In all, 16 files reference the old paths. .github/workflows/local-starter.yml, which P runs at stage 1, is missing from the root-split list.
  - Fix: Include all of these in the stage-0 PR. Extend P4 to run the public-release-tag tests and a release-tag dry run.
- **[should] B3 / decision 9: live private surfaces.** 'Default: leave live surfaces unchanged' quietly reverses the audit's decision-9 default (take down) and cannot hold for the docs site after stage 3a. The site uploads from R, where shared paths become the cleaned text and keep-private docs move to private/docs/, out of the routed catalog. The same applies to kingdom-bundle and the youspeak bundle once they are regenerated from the public subset.
  - Fix: Define the site's build source after 3a (the public subset plus an optional private overlay), or state that 3a implies takedown. Ask decision 9 now as its own question, because the exposure is live today and does not depend on P.
- **[should] Agent instructions / kingdom metadata (root collisions).** R's root AGENTS.md, CLAUDE.md and kingdom.yaml are R-only. P cannot add its own before stage 3 without an add/add conflict, so agents developing in P during stages 1-2 get no repo instructions, and `/kingdom map` cannot see P.
  - Fix: In stage 0, move R's private instructions to private/AGENTS.md and private/CLAUDE.md. Make the root AGENTS.md, CLAUDE.md and kingdom.yaml shared public versions with one line: 'if private/AGENTS.md exists, read it'. No new rule pile.
- **[should] Widenings (stages 2-3).** If R edits a widened area between the widening export and the merge-back, the result is an add/add conflict. The conflict table sends that case to 'relocate into private/', which is wrong for ordinary development work.
  - Fix: Set a freeze window for each widening. Add the rule: if R changed a widened path after export, re-export the newer blob into P before merging back.
- **[note] Decision 20 / Codeberg.** The Codeberg copy (zerone-dev/agenttool, which may hold private history; Desktop/agenttool's origin) is not on Yu's list.
  - Fix: Carry decision 20 into the 'later' list with the audit's default.
- **[note] B10 / decision 17 leftovers.** Dropped:
- rotation of the yutabase deploy key;
- the re-check of the 2026-09-04 posture items (origin auth, DNSSEC, the fail-open limiter, backups);
- review of #475, #476 and #486;
- the karma-mirror honeypot ruling.
  - Fix: Add them to G0 hygiene and the stage-3 batch.
- **[note] B13 deploy secrets / deploy trigger.** A protected production env cannot be enforced on R under GitHub Free (rulesets and protection return 403; env branch policies are likely unenforced), and the plan does not say so. deploy-api.yml triggers on push to main for api/** and docs/** (verified). A merge-back that an agent pushes with the user token will therefore deploy once the budget returns. 'Deploys stay explicit dispatches' holds only for GITHUB_TOKEN pushes, and the stage-1 docs blobs sit under docs/**.
  - Fix: State both facts. Either make deploy-api dispatch-only, or accept push deploys gated on P CI. Keep the step-scoped, expiring Fly token.
- **[note] Issue migration.** P is created with issues disabled, so the public has no bug channel except private vulnerability reporting. There is no policy for R's 9 open issues that concern shared code.
  - Fix: Add a one-line decision: issues on or off in P. Re-file sanitized copies only where needed; never migrate automatically.
- **[note] L4 leak response.** After a branch is deleted, its objects can persist through forks of a public repo and refs/pull (inferred GitHub behaviour). L4 covers only branch deletion and a Support purge.
  - Fix: Mention the fork network in L4: check for forks during the exposure window, and include them in the Support request.
- **[note] Risk table accuracy.** The 5 stage-1 rewrite files are said to be 'not reachable through git'. Their old bytes stay in agenttool-packages' public, append-only history.
  - Fix: Have Yu accept this explicitly, or record that it is the status quo.
- **[note] Merge-back vs R hooks (untested).** Two interactions are untested. A conflict-resolution commit in the merge clone hits the R pre-commit hook (it needs ALLOW_SHARED_EDIT). The R pre-push drift check compares against the old origin/public-sync, while the same atomic push moves it. The rehearsal installs neither hook in the merge clone.
  - Fix: Add both cases to P6/P8.
- **[note] Yu's decision: development in public.** api, apps, docs and bin development stays private until a large batch of rulings and refactors (stage 3), with no time box. That risks a long half-public state.
  - Fix: Set a target date and success criteria for M2 (stage 3b: api development in P), and review it at each weekly merge-back.
- **[note] B11 licensing.** The projection's 41-line LICENSING.md replaces R's 72-line root file, which carries exceptions for docs/specs, api routes and the jsonld files. There is no inbound-licence note for public PRs merged into a private repo.
  - Fix: At stage 3, merge R's exceptions into the shared LICENSING.md. Add an inbound=outbound (Apache-2.0) or DCO line to CONTRIBUTING.
- **[note] Migration twins.** Twin headers publish the sha256 of each private original. That is a small guess-confirm surface.
  - Fix: Accept it, or key twins by an HMAC whose key stays in R.

