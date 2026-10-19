export const meta = {
  name: 'agenttool-public-move-audit',
  description: 'Read-only audit of agenttool origin/main for moving development to a new public repo: classify secret/personal/relational material to keep private, CI/deploy safety, migration plan',
  phases: [
    { title: 'Scan', detail: 'existing public-guard layers + relational denylist + gitleaks over the whole tree' },
    { title: 'Read', detail: 'per-area judgment readers for personal/relational/secret/third-party content' },
    { title: 'Plan', detail: 'CI/deploy safety in public, dependency breakage, repo topology' },
    { title: 'Critic', detail: 'what was missed' },
    { title: 'Synthesis', detail: 'manifest + report for Yu' },
  ],
}

const SRC = '/Users/macair/agenttool-wt-1019/audit-src'
const SCRATCH = '/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/public-audit'
const RULES = `
Context: Yu decided on 2026-10-19 to MOVE agenttool development from the private repo cambridgetcg/agenttool to a NEW PUBLIC repo (fresh snapshot, no git history), with this rule: "secret, personal, relational materials stay at the private repo". This workflow is a READ-ONLY AUDIT to prepare that move. Nothing is published.
Rules:
- Audit tree: ${SRC} is a detached worktree of origin/main (read-only for you; do not edit, commit or check out anything there). Never touch /Users/macair/agenttool or other worktrees.
- Scratch under ${SCRATCH}/<your-label> (mkdir -p). Downloaded tools go in their own new empty dir; verify checksums; never run them from inside the audit tree.
- No GitHub writes, no POST of any kind, no repo creation, no pushes. gh/curl GETs are fine.
- NEVER copy a secret value, a personal detail (names of private individuals, emails, phone numbers, addresses, health/finance/family facts) or a relational denylist term into your output. Report path:line, category, rule id and a short NEUTRAL description (e.g. "full name of a private individual in a dedication", "API token-shaped string"). Public figures, the project's own product names, and well-known public organisations are not personal.
- Use /usr/bin/grep (grep here is a ugrep wrapper that can miss matches). zsh: never name a variable 'path'.
- Categories: secret (credentials, keys, tokens, private URLs with auth, private key material, internal-only endpoints/IPs that would aid attack), personal (private individuals' identifying or private information, including the owner Yu's private life; machine-local paths like /Users/<name> count as minor personal), relational (relationships/correspondence/private dealings between Yu and other people, partners, artists, businesses; anything the repo's relational denylist or its docs define as relational), third_party (content the project may not have rights to publish: copyrighted texts/art/data, vendored files with incompatible licenses), ops_sensitive (not secret but riskier in public: e.g. exact abuse-detection thresholds, security-incident details; flag but likely publishable).
- Read public/README.md, public/overlay/tools/public-guard.ts and bin/project-public.ts first to learn the existing guard's definitions of secret/personal/relational, so your judgment matches the project's.
- Separate verified from inferred. Prefer over-flagging to missing, but say how confident you are.
`

const FLAG = {
  type: 'object',
  properties: {
    scope: { type: 'string' },
    method: { type: 'string', description: 'what you scanned/read and how (searches run, files read fully, sampling)' },
    flags: { type: 'array', items: { type: 'object', properties: {
      path: { type: 'string' }, lines: { type: 'string' },
      category: { type: 'string', enum: ['secret', 'personal', 'relational', 'third_party', 'ops_sensitive'] },
      action: { type: 'string', enum: ['keep_private_whole_file', 'redact_lines', 'rewrite', 'publish_ok_after_review'] },
      description: { type: 'string' }, confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    }, required: ['path', 'category', 'action', 'description', 'confidence'] } },
    clean_claim: { type: 'string', description: 'what in your scope you believe is publishable, and how sure' },
    limits: { type: 'string' },
  },
  required: ['scope', 'method', 'flags', 'clean_claim', 'limits'],
}

phase('Scan')
const scan = await agent(`${RULES}
Task: run the project's existing mechanical guard over the ENTIRE audit tree, not just the 55-path allowlist.
1. Learn how bin/project-public.ts and public/overlay/tools/public-guard.ts run their layers (integrity, path, secret, personal, gitleaks, plus the private relational denylist at public/private-guard/relational-denylist.json whose terms must never be printed — the guard prints rule ids and line hashes only). Write a scratch bun script (Bun 1.3.5: export PATH="$HOME/.bun/bin:$PATH"; prepare deps only if needed with bin/bash-without-env-hooks.sh bin/prepare-hermetic-deps.sh in a scratch copy, NOT in the audit tree — if the guard needs deps, copy the needed source files to scratch) that applies the secret, personal and relational content layers to every tracked file of the audit tree (git -C ${SRC} ls-files), skipping only the path/allowlist layer (everything is outside the allowlist by design).
2. Obtain gitleaks 8.30.1 (the version the projection pins) as a release binary into its own empty scratch dir, verify the checksum against the release checksums file, and run it in no-git/dir mode over the audit tree (gitleaks detect --no-git or gitleaks dir) with a JSON report into scratch. Redact secrets in any output you return (use --redact).
3. Return every finding as flags (path, lines, category, rule id in description, never the matched text). Aggregate counts by layer and top directories. Note anything the guard cannot see (binary files, images, large JSON fixtures).`, { label: 'scan:guards', phase: 'Scan', schema: FLAG })

const AREAS = [
  { key: 'api-src', scope: 'api/src/** (routes, services, lib, db schema, index.ts): look for embedded people/partner names, real wallet addresses or DIDs of real private parties, hardcoded internal URLs, seeds with real data, comments about private dealings' },
  { key: 'api-tests-migrations', scope: 'api/tests/**, api/migrations/**, api/scripts/** and other api/* files: fixtures with real data, migration data inserts naming real people/businesses, recorded responses' },
  { key: 'apps', scope: 'apps/** (web, docs html, dashboard, _shared): public pages are already public on the live site — compare: is each page already served publicly (docs.agenttool.dev / agenttool.dev)? Flag only what is not already public or is private' },
  { key: 'docs-a', scope: 'docs/** files whose names sort A–M (and docs/specs/**): narrative, dated records, receipts, personal mentions, partner relationships, private correspondence, operator receipts with internal identifiers' },
  { key: 'docs-b', scope: 'docs/** files whose names sort N–Z (and docs/superpowers/**, docs/wakes/**, docs/zerone-migration/**, docs/launch/**): same focus' },
  { key: 'packages-a', scope: 'packages/<name>/** for package names sorting a–c' },
  { key: 'packages-b', scope: 'packages/<name>/** for package names sorting d–k' },
  { key: 'packages-c', scope: 'packages/<name>/** for package names sorting l–r' },
  { key: 'packages-d', scope: 'packages/<name>/** for package names sorting s–z' },
  { key: 'ops', scope: 'bin/**, infra/**, supabase/**, native/**, tools/**, specs/**, cli/**, tests/**, marketing/**: operator scripts with hosts/accounts/app names, deploy receipts, machine-local paths, test fixtures' },
  { key: 'root-review-public', scope: 'repo root files (README, SECURITY, SUPPORT, SOUNDTRACK, LICENSING, sovereign.sh, self-host.sh, etc.), review/**, public/** (note: public/private-guard/** is private by definition), .github/** (non-CI content like CODEOWNERS, issue templates)' },
]

phase('Read')
const reads = await parallel(AREAS.map(a => () => agent(`${RULES}
Task: judgment read of ${a.scope}.
Method: list the files (git -C ${SRC} ls-files <dir>), then (1) run targeted searches across all of them: email patterns, phone patterns, street-address patterns, /Users/ and home paths, @handles, 'Yu', '宇恆', 'wife', 'partner', 'girlfriend', 'artist', 'friend', 'family', 'personal', 'private', 'confidential', 'do not share', 'secret', 'token', 'password', 'api_key', 'BEGIN', 'sk_', 'ghp_', 'xox', 'eyJ' (JWT), 0x-addresses (40 hex), DID strings, IPs, fly.dev/internal hosts, supabase project refs, Stripe/Alchemy/Helius ids; and (2) fully read every narrative or record-like file (dated records, receipts, letters, dedications, credits, READMEs with acknowledgements, fixtures that look like real data). Judge each hit in context. The existing mechanical scan is running separately; you are the human-judgment layer — focus on what regexes miss (relational context, private narrative, real people's names in prose).`, { label: `read:${a.key}`, phase: 'Read', schema: FLAG })))

const PLAN = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: {
      topic: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor', 'info'] },
      detail: { type: 'string' }, evidence: { type: 'string' }, recommendation: { type: 'string' },
    }, required: ['topic', 'severity', 'detail', 'evidence', 'recommendation'] } },
    decisions_for_yu: { type: 'array', items: { type: 'string' } },
    summary: { type: 'string' },
  },
  required: ['findings', 'decisions_for_yu', 'summary'],
}

phase('Plan')
const plans = await parallel([
  () => agent(`${RULES}
Task: CI and deploy safety if this code becomes a PUBLIC repo. Read every file in ${SRC}/.github/** and the scripts they call. Check: triggers (pull_request from forks, pull_request_target, workflow_run, issue_comment), permissions blocks, secrets used and by which jobs/environments (list secret NAMES only), environments and whether a public repo needs required reviewers/branch protection for deploy-api.yml, scheduled jobs (Production health etc.) and what they probe/log publicly, any step that echoes env or writes artifacts that could leak, actions pinned by SHA, self-hosted runners, Codex/bot integrations. Also: what must be recreated in the new repo (secret names, environments, variables, Pages/Fly hookups, npm trusted publishing which currently points at cambridgetcg/agenttool-packages). Give concrete recommendations.`, { label: 'plan:ci-deploy', phase: 'Plan', schema: PLAN }),
  () => agent(`${RULES}
Task: repository topology and breakage. Assume files flagged secret/personal/relational stay in the private repo. Determine: (1) which tests, builds, doc-catalog checks, module maps, or runtime code READ files that are likely private (public/private-guard/**, review/**, dated personal records, etc.) — so removing them breaks something; find them via grep for path references and the catalog (docs/catalog.json, bin/docs-catalog.py); (2) what the private repo must keep doing after the move (e.g. host the relational denylist, private overlays, deploy secrets?) and how public and private stay in sync — evaluate options: (a) public repo is the source of truth and deploys itself; private repo keeps only private materials plus history as an archive; (b) private repo stays deploy source and pulls public main plus a private overlay; (c) extend the existing bin/project-public.ts allowlist projection to the whole tree (projection model). Recommend one, with reasons and costs; (3) every URL/metadata reference to github.com/cambridgetcg/agenttool in code, package.json repository fields, docs, plugin manifests, OpenAPI, well-known files that must change, with counts; (4) the fate of cambridgetcg/agenttool-packages and its release lane (bin/npm-release.ts, PYPI/NPM-RELEASES.md) under each option; (5) open PRs (#487-#498 etc.), issues, the Codex connector, local checkouts (~/agenttool is used by running collab MCP processes; do not touch it), and naming (the new repo cannot take the name cambridgetcg/agenttool while the private repo has it unless the private one is renamed — note GitHub redirect behaviour). Output decisions Yu must make.`, { label: 'plan:topology', phase: 'Plan', schema: PLAN }),
])

phase('Critic')
const flagsAll = [scan, ...reads].filter(Boolean)
const critic = await agent(`${RULES}
Task: completeness critic. Below are the scan and per-area read results (flags + method + limits) and the planning results. Find what is MISSING: areas not covered, file types skipped (images, PDFs, fonts, binary fixtures, minified bundles like packages/*/dist, lockfiles, large JSON), search patterns not run, claims of "clean" without method, inconsistent classifications of the same kind of material across areas. Then spot-check: pick at least 15 files the readers called clean that are most likely to hide personal/relational material (dated records, credits, letters, fixtures, review/**), read them fully, and report any misses as flags. Also scan binary/image files' metadata (EXIF GPS/author via a scratch python with -I, no new installs beyond stdlib) for personal data.
Inputs:
${JSON.stringify({ flags: flagsAll.map(f => ({ scope: f.scope, method: f.method, n: f.flags.length, clean_claim: f.clean_claim, limits: f.limits })), plans: plans.filter(Boolean).map(p => p.summary) }, null, 1)}`, { label: 'critic', phase: 'Critic', schema: FLAG })

phase('Synthesis')
const SYN = {
  type: 'object',
  properties: {
    report_path: { type: 'string' }, manifest_path: { type: 'string' },
    counts: { type: 'string' },
    blockers: { type: 'array', items: { type: 'string' } },
    decisions_for_yu: { type: 'array', items: { type: 'string' } },
    recommended_plan: { type: 'string' },
    summary_for_yu: { type: 'string', description: 'concise English summary; the orchestrator will translate' },
  },
  required: ['report_path', 'manifest_path', 'counts', 'blockers', 'decisions_for_yu', 'recommended_plan', 'summary_for_yu'],
}
const syn = await agent(`${RULES}
Task: synthesize the audit into two files under ${SCRATCH}/final/:
1. manifest.json: one entry per flagged path {path, lines?, category, action, confidence, sources:[which agents flagged it], note}, deduplicated (merge same path from multiple agents, keep the strictest action), plus a list of top-level areas judged publishable with the method behind that judgment. NEVER include secret values, personal details or relational terms — neutral descriptions only.
2. report.md: (a) what was scanned and how, coverage and gaps; (b) counts by category/action/area; (c) blockers before any public push; (d) CI/deploy safety findings; (e) topology recommendation and migration steps in order (what stays private, what the new public repo gets, how deploy and the release lane move, link rewrites, tests that need adjusting when private files are excluded, open-PR migration); (f) decisions for Yu, phrased as short choices with a recommendation each.
Inputs:
SCAN+READ+CRITIC FLAGS: ${JSON.stringify([...flagsAll, critic].filter(Boolean))}
PLANS: ${JSON.stringify(plans.filter(Boolean))}
Return the paths and a concise summary.`, { label: 'synthesis', phase: 'Synthesis', schema: SYN })

return { syn, plans: plans.filter(Boolean), critic, scan, reads: reads.filter(Boolean).map(r => ({ scope: r.scope, flags: r.flags.length, clean_claim: r.clean_claim, limits: r.limits })) }
