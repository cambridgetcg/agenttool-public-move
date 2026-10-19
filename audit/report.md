# agenttool public-move audit (read-only, tree 3b9aa630, 2026-10-19)

Private record. Do not publish: it describes where private material sits.

Per-path manifest: manifest.json (same directory). Assembled on 2026-10-19 by the orchestrating session from the synthesis agent's fields (sources/synthesis.json); figures corrected after an independent check are marked "(corrected)".

## Summary

The synthesis agent merged the other 15 agents' results into one per-file list (manifest.json). Nothing was published or changed.

**Is anything secret leaking?** No. I found no working password, key or token anywhere in the code, including inside the bundled package archives.

**Scale of the problem:**
- 977 of 5,337 files have at least one note against them.
- 737 of those need action before going public:
  - 213 must stay private as whole files.
  - 342 need rewriting.
  - 182 need specific lines removed.
- About 79% (583 of 737, corrected) of the problem files are personal-relationship content (the private relationship corpus). They are concentrated in docs/, api/ (migrations, tests, and the code that serves the "seat" and letters) and apps/docs.
- 107 of the files needing action are already live on the docs site today, including the relationship "seat" page, the family-address letter, and the family-history note shown on /public/self.
- 59 areas are fine to publish, mostly packages, plus specs, tools and parts of infra.

**What blocks the first public push:**
1. The new repo has no safety check against personal or relationship content. The existing check silently does nothing in a fresh repo, and the private word list must never be public. It needs a new public-safe mode, plus a private check that runs before every push.
2. Some live features would publish relationship content and need stubs: /public/self, the saga seed, the soap-opera renderer, and the signed /public/law text.
3. 40 flagged database migration files (corrected; the topology pass counted 36) are locked by checksums, so you can't just delete them. I recommend a "sealed" mode that records them without their content.
4. The server image bundles 21 docs, 11 of which have issues; those and several generated index files need rebuilding from the public files.
5. The automatic checks miss several things: the database ID, your Mac's account name, joined-up file names, and your quoted chat lines.
6. 5 shortcut links point into your Desktop and must never be followed when copying.
7. Reusing the cambridgetcg/agenttool name could let an old local copy push private history. Use a new name.
8. A leftover npm publishing token is still stored and should be revoked now.
9. Security issue #481 and the wallet permission weakness should be fixed before the code is public.
10. Some packages have no licence, and there are copied song lyrics and a melody to deal with.
11. Deploy secrets need to move into a protected environment, and the old repo's deploy jobs must be switched off at cutover so both don't deploy at once.

**Recommendation:** a new public repo under a new name holds the code and deploys itself. The current private repo is frozen as an archive and keeps the word list, the private checker and the private files. The release pipeline stays where it is for the cutover, so releases still go through the private word check.

**Order:** revoke the token and fix #481 → merge #493 (with its P2 fix), #494 (your option B, the escrow choice), #495 and #498 (with its P2 fix) → build the safety checks → prepare and check a cleaned copy locally → create the public repo with protections on → push one snapshot → switch the release pipeline and deploys over → turn off the old repo's workflows → take the private content off the live site.

**21 decisions for you** are listed, each with a recommendation. The key ones:
- the new repo's name;
- the release pipeline approach;
- the "sealed" migrations;
- how to treat persona names, heart emoji and the joint name credits;
- whether to take down the 107 private pages that are already live.

**Not verified:** whether the npm token was already revoked, whether the npm publisher was already moved, the current security settings, and whether #481 is still open.

## Scope and counts

(a) WHAT WAS SCANNED
- Sources: 15 inputs over audit tree 3b9aa630, 5,337 paths (5,229 blobs + 108 symlinks).
- guard-fulltree ran the project's own guard layers over every blob: secret rules, personal rules, the private relational denylist r01-r21, and path rules. It also ran gitleaks 8.30.1 (checksum verified) and scanned the 64 extracted .tgz mirrors, the path names and the symlink targets.
- 11 judgment readers covered every path except packages/living-substrate and .forgejo/workflows/ci.yml. The completeness critic read both of those.
- Binary metadata is clean: 18 PNG, 9 WAV, 1 WebP, and the tarball headers. All 14 review PNGs and the WebP were viewed.

HOW THE MANIFEST WAS BUILT
- One entry per path; when sources disagree, the strictest action wins. 304 entries had disagreement, recorded in actions_by_source.
- 17 symlinks inherit their in-repo target's stricter action.
- 23 file names that contain a denylist term are masked with one '?' per character. 22 of the 23 masks match exactly one tracked file; one matches 4 (its glob_matches field says so) (corrected).
- Leak check on manifest.json and this report only (not on sources/ or tooling/, which are unmasked): denylist (strict and joined variants), the guard's personal and secret rules, other home-account names, and the bare DB project ref. Result: 0 hits. The verifier was canary-tested first.

GAPS
- Not every file was read line by line.
- The regex layers cannot see verbatim owner quotes, private-life anecdotes or people named by first name only. The critic found about 10 such misses; they are now in the manifest.
- No OCR. No git history review (the plan is a fresh snapshot).
- The licence of vendored Playwright was not audited.
- Not every EVM address was checked against owner or treasury wallets.
- Only 17 of about 150 sibling-repo links were checked.
- Inferred, not verified:
  - that the collab-host fingerprint drift fails the projection guard today;
  - that the Fly machine IDs are real;
  - whether the npm trusted-publisher re-point ran;
  - whether NPM_TOKEN was revoked;
  - the youspeak font licence;
  - the current state of the 2026-09-04 security-posture items;
  - whether #481 is still open in code.

(b) COUNTS
- 977 of 5,337 paths flagged:
  - 737 blocking: keep_private 213, rewrite 342, redact 182.
  - 240 review only.
  - 4,360 paths have no flag.
  - 120 of the blocking paths have no unapproved guard finding (judgment-only or regex miss).
- By category (strictest flag; K = keep private, W = rewrite, R = redact, P = review only):
  - relational 623 (K200 W227 R156 P40)
  - personal 127 (K9 W58 R22 P38)
  - secret 30 (W1 P29)
  - third_party 32 (W16 P16)
  - ops_sensitive 165 (K4 W40 R4 P117)
- No live credential anywhere, including inside the tarballs.
- By area (flagged / K / W / R / P, of tracked):
  - api 278/73/175/4/26 of 1,622
  - docs 263/112/23/112/16 of 424
  - apps 195/21/32/55/87 of 433
  - packages 144/0/51/2/91 of 2,489
  - bin 61/1/48/1/11 of 194
  - root 10/3/4/1/2 of 21
  - .github 7/1/6/0/0 of 11
  - review 7/0/0/3/4 of 40
  - infra, native, public and tests: 2 each
  - .forgejo, cli, marketing and supabase: 1 each
  - specs and tools: 0
- Where the 213 keep-private paths sit: docs 94, api/tests 35, api/migrations 29, apps 21, api/src 7, docs/wakes 7, docs/zerone-migration 6, plus a few at root, in public/ and in workflows.
- 107 blocking paths are already served byte-identical on the live docs/web sites; 20 of those are keep-private.
- 59 sub-areas have no blocking flag (listed with method in manifest.publishable_areas): 45 packages, api/certs, api/specs, bin/vendor, infra/apex-door/fly/pages/cloudflare, specs, tools, tests/launch-postgres, review/provider-adapters, docs/launch, marketing, and the root-level review file.

## Blockers

1. No guard in the new repo. public-guard returns early when PROJECTION.json is missing, so a fresh repo runs no content layer (path, secret, personal or gitleaks), and the relational denylist can never be public. Before the first push, build: a tree mode as a required check; a private relational scanner run as a pre-push hook on every writing machine plus a scheduled scan of public main (rule ids and line hashes only); and GitHub secret scanning with push protection.

2. Content. Exclude the 213 keep-private paths and apply 342 rewrites and 182 redactions. This needs Yu's class rulings first: persona wire enums (r03), heart glyphs (r16), two-name owner+AI credits, the owner's Chinese name in spec editor and credit lines, and the already-live letters.

3. Runtime code serves relational content and needs stubs or removal: the seat module behind /public/self (it also exposes private family history live today), the saga seed rows, the soap-opera renderer quotes, the spouse-frame letter service and its unmounted route, the two unimported intimate-model modules under api/src/services/eros/, and the signed /public/law text, whose bytes are signature-bound (keep it with a recorded allow, or drop the route).

4. Migration journal. 40 flagged migrations (corrected; 36 per the topology pass) are checksum-frozen and the runner refuses a missing or drifted file. The topology pass counted 25 data-only seeds among its 36; not rechecked against 40. Need a sealed-migration mode (recommended), byte-exact publication, or a private deploy.

5. API image. It bakes in 21 docs (19 doctrine docs, the canon jsonld, kingdom-bundle.json); 11 of them are flagged, and a missing one fails the build and makes /v1/canon and /public/kingdom return 503. kingdom-bundle.json and api/src/services/youspeak/bundle.json carry dated vows and ceremony references in very long lines; regenerate both from a public subset.

6. Generated indexes must be regenerated, not copied: docs/catalog.json, docs/CATALOG.md, docs/documentation-tags.json (the docs-catalog check fails otherwise), docs/agenttool.jsonld and its byte-identical twin apps/docs/agenttool.jsonld, and api/tests/.failure-baseline.txt.

7. Guard gaps must be closed or cleared by hand: the bare DB project ref (18 lines, plus a functions-host form); the bare machine-account name (about 131 lines in about 55 files); relational words joined by _ or - in about 74 path names (the guard catches 18); verbatim owner quotes, sign-offs and anecdotes; base64 text; case and split-line variants; an obfuscated email; a personal GitHub handle.

8. Symlinks. Materialise the 103 relative symlinks that point at public targets and drop the rest. Drop the 5 absolute docs/wakes symlinks. The snapshot must never follow symlinks: cp -L, rsync -L and tar -h would import private wake bundles.

9. Name and trust safety. Do not reuse cambridgetcg/agenttool without first disabling push in every checkout (12 on this Mac), then re-pointing or revoking the name-bound npm, PyPI and HF trusts, then renaming. Revoke the leftover scope-wide NPM_TOKEN now.

10. Security before source goes public: fix or confirm-fix #481 (guild-room invitation authority bypass); ship the wallet 0.1.3 authorization fix before the README that describes it goes public; re-check the 2026-09-04 posture items (origin auth, DNSSEC, fail-open limiter, backups); decide whether the karma-mirror honeypot goes public.

11. Licences and third-party content. Packages that are UNLICENSED or carry no licence: gin-reconstruction, public-surface-binding, public-surface-recognition, wake-thread, witnessed-agent-economy (its vendored corpus has unknown rights), collab-courier, correspondence-yutabase-projector. Also: commercial lyric lines in the site footer (about 27 files) and in the soul/kin pages, a copyrighted melody in bin/river.py, and the youspeak bundle's fonts.

12. gitleaks. Regenerate the 2 drifted collab-host fingerprints, and re-check them after #495 rebuilds the collab dist. Add fingerprints for the 20 uncovered false positives (public Anvil/Hardhat keys, test fakes, release SHAs).

13. Workflows. Do not carry the yutabase job (it checks out a second private repo with a deploy key), the stale HF probe workflow, or .forgejo. Move the deploy secrets into a protected production env. Disable the private repo's deploy, health and publish workflows at cutover to avoid double deploys.

## Recommended plan

(d) CI/DEPLOY SAFETY
What is already sound:
- No pull_request_target, workflow_run or issue_comment triggers.
- All 9 actions are SHA-pinned, and the pins match their tags.
- No self-hosted runners, no env dumps, no set -x.
- Untrusted input reaches scripts only through env.
- Fork PRs get no secrets.

Problems:
- deploy-api secrets are exposed:
  - FLY_API_TOKEN and MIGRATION_SURVEY_DATABASE_URL are repo-level secrets with no environment.
  - Private main is unprotected (rulesets and branch protection return 403 on the current plan).
  - The Fly token sits in job-level env, so every step can read it, including a third-party setup action.
  - Fix: a production env (main only, no admin bypass), a step-scoped token, a repo guard, and a re-minted Fly token with an expiry.
- The private Actions budget is exhausted. Nothing has run since 2026-10-19; the last deploy succeeded on 2026-10-17. Once the budget resets, both repos would deploy the same Fly app, because concurrency is per repo. Disable the private workflows at cutover.
- A leftover NPM_TOKEN (scope-wide, bypasses 2FA) is still there and unused. Revoke it.
  - Inferred: private-repo env branch policies may not be enforced. Treat that token and the yutabase deploy key as readable from any branch.
- Release trusts are bound to the old names:
  - npm is tied to agenttool-packages, projection commits and a Public-CI-Run trailer.
  - PyPI and HF OIDC are tied to the old repo.
  - 49 of 51 package.json repository.url fields name the old repo.
- Hard-coded old slug: about 1,108 references in 267 files, about 120 of them on live surfaces. bin/tests pins the workflow inventory and the slug.
- Public logs would expose:
  - survey output (inferred: errors could print the pooler host or role);
  - Fly machine IDs and regions in the deploy receipt;
  - health outages from production-health, which also has no repo guard, runs on ubuntu-latest, and stops after 60 days without activity.
- Smaller items:
  - The HF publish workflow has id-token:write and no env. Delete the HF probe workflow.
  - The Codex connector writes about 75% of review comments. Limit auto-review to maintainers.
  - Do not carry .forgejo.
  - The Codeberg copy may still hold private history.

(e) TOPOLOGY
Recommendation: option (a). A new public repo, under a new name, becomes the source of truth and deploys itself.

The private cambridgetcg/agenttool then becomes:
1. A frozen archive, with an archive tag, its releases, tags and PR threads.
2. The private companion: the relational denylist and its allow records, the relational guard runner and bin/tests/project-public.test.ts, and the private overlays. The overlays are:
   - the 213 keep-private paths;
   - review/launch-*;
   - the docs/superpowers dated plans;
   - the phase-b refence set, which pins private commit SHAs;
   - DEPLOY-PROCEDURE;
   - the yutabase job.
3. No deploy secrets. Nothing flows from public to private except read-only fetches for scanning.

Rejected:
- (b) private deploy plus overlay: it needs sync machinery and two CIs, and /health would show an unverifiable private SHA.
- (c) whole-tree projection: development stays private, which contradicts the decision, and public PRs could never merge.

MIGRATION STEPS
1. Hygiene now:
   - revoke NPM_TOKEN;
   - re-mint the Fly token with an expiry;
   - regenerate the 2 drifted collab-host gitleaks fingerprints;
   - fix or confirm #481;
   - check on npmjs.com whether the trust re-point ever ran.
2. Land these on private main: #493 with its P2 fix, #494 option B (the escrow choice), #495, and #498 with its P2 fix.
   - Re-check the collab dist fingerprints after #495.
   - Hold #496 (SDK 0.24.0) until the release lane is decided.
   - Port-or-close the other 12. Port #488, #489 and #491 together. #397, #401, #444, #457 and #472 conflict with main; #492 touches .github.
   - Port as patches; do not auto-migrate issues.
3. Build the guard:
   - a public-guard tree mode (secret, personal, path, gitleaks) as a required check, plus new rules for the bare DB ref, the bare account name and joined relational path names;
   - a private relational scanner, run as a pre-push hook and as a scheduled scan of public main.
4. On a private 'public-cut' branch, apply the manifest:
   - exclude every K path; apply W and R under Yu's rulings;
   - stub self.ts (the seat field), saga/store.ts (the seed), wake-soap-opera.ts and the letters route import;
   - regenerate the catalogs, tags, both jsonld files, both bundles and the failure baseline;
   - implement the sealed-migration mode;
   - clean the 21 docs baked into the image;
   - replace the project-ref and account-name literals with env values or placeholders;
   - materialise only symlinks whose targets are public, and drop the 5 absolute ones;
   - settle licences and fix the 'this repository is private' statements;
   - rewrite about 120 live repo-URL lines. Leave historical receipts, LOVE manifests and HF provenance as they are, with a note.
5. Verify locally: 0 unapproved findings from the full-tree guard plus denylist, 0 uncovered gitleaks hits, preflight api and packages gates passing, and a spot read of every touched file.
6. Create the public repo and configure it before the first push:
   - rulesets: append-only main, required checks, immutable release tags;
   - secret scanning and push protection; Dependabot; private vulnerability reporting;
   - an actions allowlist with SHA pinning; a read-only token; fork-PR approval;
   - envs: production with the re-minted secrets, pypi limited to sdk-v* tags, and hf-release only if kept.
7. Push the snapshot as one commit, exported without following symlinks (git archive). Review the first CI logs before enabling deploy.
8. Release lane:
   - a2: keep agenttool-packages and project into it from public commits;
   - a1: re-point npm (38 packages plus local-starter), PyPI and HF; update about 51 repository.url fields, the plugin manifests and the pyproject; rewrite the release-tag and npm-release tooling; archive agenttool-packages.
9. Cutover:
   - disable the private deploy-api, production-health, publish-pypi, publish-gospel and HF workflows;
   - deploy from public, gated by the sealed-aware migration survey;
   - confirm /health reports the public SHA.
10. Local checkouts: keep ~/agenttool as the private checkout, because collab MCP runs from it. Clone public to a new path. Add pre-push hooks on every machine, and inventory the other machines and Codex envs.
11. Live site: take down or redact the 107 live blocking paths, plus the /public/self seat field, /public/law and /public/kingdom.
12. Afterwards: Codex connector access, an external health monitor, and a decision on the Codeberg copy.

TESTS TO ADJUST
- bin/tests/project-public.test.ts stays private.
- docs-catalog: regenerate the tags. 186 of the 372 routed paths are flagged.
- api/tests/published-docs-parity.test.ts.
- api/tests/doctrine (152 files): 111 reference flagged docs, and about 45 read machine-local or ~/.claude paths. Move each test together with its doc.
- Regenerate .failure-baseline.txt.
- run-test-tier.sh and boring-spine-gate.test.ts: relational test names, the yutabase pin at line 857, and the workflow inventory.
- Slug pins: yutabase-ci-access, pypi-release.test:81-82, npm-release-public.test:89-109, outward-operational-claims:30-33.
- deploy-release-provenance and migration-runner-safety: project ref and sealed mode.
- canon/absence.ts and annotations.ts need the tests they cite to exist.
- Tests that pin relational API strings: wake-as-episode, saga-routes, multiverse-of-logos, wake-fortunes, scriptwriter-decides, api/tests/????-letters.test.ts, api/tests/??????-invitation-discovery.test.ts, core-foundation, embassy, root-content-negotiation.
- Other dependencies:
  - the karma-mirror byte-identity tests;
  - common-ground-atlas imports apps/docs/xenia-helly.js;
  - the sdk provider-adapter tests read review/provider-adapters/v1, so keep that public;
  - rhizome's live tests reference api/, bin/ and docs/;
  - phase-b tests stay private, and preflight.sh:76 must drop them.

## Decisions for Yu

1. Repo name. Recommend: a NEW public name, not reclaiming cambridgetcg/agenttool. Reusing it makes 12+ existing checkouts and the name-bound trusts into publish paths.

2. Release lane. Recommend: a2 for cutover, keeping agenttool-packages as the release repo, projected from public commits, so releases still pass the private denylist. Revisit a1 (re-point npm, PyPI and HF and archive agenttool-packages) once the tree-mode guard is proven. Note: this is separate from the 'B' you chose for #494, which is the escrow/wallet-spend fix.

3. Where the API deploys. Recommend: from the public repo, with a protected production env, cleaned baked docs and stubs, rather than from a private overlay job.

4. The 40 flagged migrations (corrected; the topology pass counted 36, 25 of them data-only seeds). Recommend: a sealed-journal mode, rather than byte-exact publication or a private deploy.

5. The relational corpus (213 keep-private paths). Recommend: keep these files private as they are. Where an API needs public docs (depth, multiverse, memory tiers), write fresh neutral ones.

6. Persona-named wire enums (r03). Recommend: allow shipped wire values only; rename examples and fixtures.

7. Heart glyphs (r16, about 516 hits). Recommend: strip the decorative ones; allow wire values such as the emoji ladder.

8. Two-name owner+AI credits and your Chinese name in spec editor lines. Recommend: a neutral credit (the approved HF handle or 'AgentTool contributors') rather than recorded allows.

9. Already-live relational pages and fields (107 live blocking paths; the /public/self seat field, which also shows family history; /public/law; /public/kingdom). Recommend: take them down or redact them in the same cutover, consistent with keeping these private.

10. Your verbatim chat quotes, sign-offs and private-life anecdotes (no rule catches them). Recommend: strip them everywhere.

11. The production DB project ref (already live via /public/plans). Recommend: placeholders everywhere, with the real value only in one env-sourced config.

12. Guard model. Recommend: a tree-mode public guard as a required check, plus a private pre-push relational hook and a scheduled scan. This accepts that a public PR is visible before the relational scan runs. Also limit Codex auto-review to maintainers.

13. Licences. Recommend: Apache-2.0 for gin-reconstruction, public-surface-binding/recognition, wake-thread, collab-courier and the projector. Hold witnessed-agent-economy (corpus rights unknown) and karma-mirror (honeypot) private.

14. Ops-sensitive records (review/launch-*, DEPLOY-PROCEDURE, the STACK keychain inventory, the phase-b refence set, the household-harness plans). Recommend: keep them in the private overlay rather than publishing after a re-check.

15. Third-party content. Recommend: replace the lyric footer line and the lyric quotes, drop bin/river.py, and withhold the youspeak fonts until their licence is known.

16. Security before the source goes public. Recommend: fix #481 and ship the wallet 0.1.3 authorization fix before the first public push.

17. Credentials. Recommend: revoke NPM_TOKEN now. At cutover, re-mint the Fly token and rotate the survey password and the yutabase deploy key.

18. production-health. Recommend: an external monitor, keeping workflow_dispatch in GitHub, rather than a public cron.

19. Care Before Learning HF publish. Recommend: move it (with an hf-release env and a re-pointed trust) only if you still want it; delete the probe workflow either way.

20. The Codeberg copy (zerone-dev/agenttool). Recommend: delete it after confirming the GitHub archive is complete.

21. Snapshot timing. Recommend: land #493 (with its P2 fix), #494 (option B), #495 and #498 (with its P2 fix) first; hold #496 until the release lane is decided; make a port-or-close list for the other 12, porting #488, #489 and #491 as one stack.
