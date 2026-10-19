import { readFileSync, writeFileSync } from "node:fs";
const W = "/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/public-audit";
const b = JSON.parse(readFileSync(W + "/synth-work/build-out.json", "utf8"));
const ACT_RANK = { keep_private_whole_file: 4, rewrite: 3, redact_lines: 2, publish_ok_after_review: 1 };
const entries = b.entries;

const readerFor = (area) => {
  if (area === "(root)" || area.startsWith("review") || area === "public" || area === ".github") return ["root-review-public-github"];
  if (area === ".forgejo" || area === "packages/living-substrate") return ["completeness-critic"];
  if (area === "api/src") return ["api-src"];
  if (area.startsWith("api")) return ["api-tests-migrations"];
  if (area.startsWith("apps")) return ["apps"];
  if (area.startsWith("docs")) return ["docs-a-m", "docs-n-z"];
  if (area.startsWith("packages/")) {
    const n = area.slice(9); const c = n[0];
    if (n === "living-substrate") return ["completeness-critic"];
    return [c <= "c" ? "pkgs-a-c" : c <= "k" ? "pkgs-d-k" : c <= "r" ? "pkgs-l-r" : "pkgs-s-z"];
  }
  return ["ops-bin-infra"];
};
const caveats = {
  "packages/common-ground-atlas": "Tests import apps/docs/xenia-helly.js and provenance pins hashes of apps/docs + docs files; move those dependencies with it (xenia-helly.html is flagged rewrite). HF handle use is the approved public one.",
  "packages/kingdom": "Protected persona term used as a wire enum (allow-listed under the delegated wire-enum rule; already on npm).",
  "packages/local-starter": "r11 foundations link carries Yu's recorded approval (2026-10-11); carry the approval record into the new guard.",
  "packages/sdk-py": "Publish-only items: approved allow entries, devotional docstring epigraph quoting the owner (client.py:13-14, already public), release-posture note in CLAUDE.md:114-118, treasury address.",
  "packages/sdk-ts": "Publish-only items: approved allow entries, unreleased notes on a metadata leak in 0.22.1, public test keys needing gitleaks fingerprints.",
  "packages/wallet": "README discloses two authorization weaknesses still present in published 0.1.3 with repro vectors — ship the fix first or together.",
  "docs/launch": "Dated 2026-09-04 production-weakness notes (PRODUCTION-GATE, ADMISSION-OPERATIONS) need a current-state check; HUMAN-DOOR-RUNBOOK clean.",
  "review": "production-launch-20260904.md carries dated security disclosures; re-check before publishing.",
  "review/provider-adapters": "Already public in cambridgetcg/agenttool-packages.",
  "infra/cloudflare": "Desired-state JSON lists provider-origin hosts that bypass the edge until origin auth lands.",
  "marketing": "DIRECTORY-SUBMISSION.md has exact MCP rate-limit windows and a now-stale 'repository is private' line.",
  "packages/memetic-landscape": "Only gitleaks fingerprint-covered false positives.",
  "packages/polymorph-landscape": "Only gitleaks fingerprint-covered false positives.",
  "packages/research-commons": "CLAUDE.md:52-53 asks to keep it out of release allowlists — confirm intent; links to private sibling repos.",
  "packages/dark-continent-karma": "hero-web.webp provenance/generator terms unrecorded (viewed: abstract illustration, no metadata).",
  "packages/constructive-intelligence": "Embeds a byte-exact copy of a separate repo's tree; confirm that side intends it public.",
  "packages/hf-training-garden": "Commit links into the private repo will 404 after the move.",
  "packages/deepseek-kingdom": "Commit links into the private repo will 404 after the move.",
  "packages/telescope": "Bundled dist has THIRD_PARTY_LICENSES; one gitleaks-covered FP.",
  "packages/wallet-zerone": "Only fingerprint-covered vectors.",
  "packages/correspondence-yutabase": "Only a fingerprint-covered test identifier.",
  "packages/living-substrate": "Not in any reader's list; critic read it in full (synthetic vectors, 0 denylist hits).",
};
const publishable = [], notPublishable = [];
for (const [area, v] of Object.entries(b.areas).sort()) {
  const row = { area, files: v.files, flagged_files: v.flagged, blocking_files: v.blocking, by_action: v.by_action };
  if (v.blocking === 0) {
    publishable.push({
      ...row,
      status: v.flagged === 0 ? "clean: no flag from any layer or reader" : "publishable: only publish_ok_after_review items (review each before push)",
      method: "Guard full-tree scan of every blob (public-guard SECRET_RULES + PERSONAL_RULES + private relational denylist r01-r21 + path rules, allowlist membership forced) + gitleaks 8.30.1 dir scan (checksum-verified) + path-name scan; judgment read by " + readerFor(area).join(", ") + "; completeness-critic coverage diff and spot reads.",
      readers: readerFor(area),
      ...(caveats[area] ? { caveat: caveats[area] } : {}),
    });
  } else notPublishable.push(row);
}

const counts = { ...b.counts, flagged_paths: entries.length, tracked_paths: b.tracked, unflagged_paths: b.tracked - entries.length, blocking_paths: entries.filter((e) => e.action !== "publish_ok_after_review").length, live_on_docs_site_and_blocking: entries.filter((e) => e.live_docs_site === "same" && e.action !== "publish_ok_after_review").length };
// recompute action/category counts after symlink inheritance
counts.by_action = {}; counts.by_category = {}; counts.by_category_action = {};
for (const e of entries) { counts.by_action[e.action] = (counts.by_action[e.action] ?? 0) + 1; counts.by_category[e.category] = (counts.by_category[e.category] ?? 0) + 1; const k = e.category + "/" + e.action; counts.by_category_action[k] = (counts.by_category_action[k] ?? 0) + 1; }
// top-level area rollup
const top = (a) => a === "(root)" ? "(root)" : a.split("/")[0];
const roll = {};
for (const [a, v] of Object.entries(b.areas)) { const t = top(a); const r = (roll[t] ??= { files: 0, flagged: 0, keep_private_whole_file: 0, rewrite: 0, redact_lines: 0, publish_ok_after_review: 0 }); r.files += v.files; r.flagged += v.flagged; for (const [k, n] of Object.entries(v.by_action)) r[k] += n; }
counts.by_top_area = roll;

const manifest = {
  schema: "agenttool-public-move-audit/manifest-v1",
  generated: "2026-10-19",
  classification: "PRIVATE. Treat like guard output: never publish, never copy into the public repo or a PR. No secret values, personal details or relational denylist terms are included; paths whose names contain a denylist term are masked with one '?' per character (path_masked: true). The masked string is itself a glob that resolves to exactly one tracked file (glob_matches).",
  audit_tree: { repo: "cambridgetcg/agenttool (private)", head: "3b9aa630bcdff3d2bdcb02eaa08094fd6d5ba45b", worktree: "detached origin/main audit worktree (read-only)", tracked_paths: b.tracked, symlinks: b.symlinks },
  owner_decisions_recorded: [
    "2026-10-19 (Yu): move development to a new PUBLIC repo as a fresh snapshot (no history).",
    "2026-10-19 (Yu): secret, personal and relational materials stay in the private repo.",
    "2026-10-19 (Yu): PR #494 -> option B; PR #495 approved; fix the P2 findings on PR #498 and PR #493.",
  ],
  field_definitions: {
    path: "Tracked path (masked with '?' per character where the name contains a relational denylist term).",
    lines: "Line numbers/ranges reported by the flagging sources, merged ('path name' = the file name itself is the issue).",
    category: "Category of the strictest-action flag; ties broken relational > personal > secret > third_party > ops_sensitive.",
    categories: "Every category any source assigned to this path.",
    action: "Strictest action across sources: keep_private_whole_file > rewrite > redact_lines > publish_ok_after_review.",
    confidence: "Highest confidence among the sources that proposed the strictest action.",
    sources: "Which audit agents flagged the path (see sources map). 'synthesis:symlink-inherit' = action raised to match the symlink's in-repo target.",
    actions_by_source: "Present only when sources disagreed; strictest kept.",
    guard: "Mechanical full-tree guard findings for this path: unapproved = no existing allow entry; approved = covered by public-guard-allow.json or denylist allow (rule ids only).",
    gitleaks: "gitleaks 8.30.1 findings on this path (FP classes noted in the note).",
    live_docs_site: "'same' = served byte-identical on the live docs/web site on 2026-10-19 (apps reader GETs); exposure predates the move.",
    note: "Neutral description(s) from each source joined by ' || '. Mechanical notes give rule-id counts only.",
  },
  sources: {
    "guard-fulltree": "Mechanical: project's own guard layers over all 5,337 paths + gitleaks 8.30.1 + tarball extraction + path names + supplemental shapes.",
    "api-src": "Judgment read of api/src (732 files).",
    "api-tests-migrations": "Judgment read of api/tests, api/migrations, api/scripts, other api/* (890 files).",
    apps: "Judgment read of apps/** incl. 64 tarball mirrors, with live-site byte comparison.",
    "docs-a-m": "Judgment read of docs A-M, docs/launch, docs/specs (216 files).",
    "docs-n-z": "Judgment read of docs N-Z, superpowers, wakes, zerone-migration, launch, specs (246 files).",
    "pkgs-a-c": "Judgment read of 12 packages a-c.",
    "pkgs-d-k": "Judgment read of 18 packages d-k.",
    "pkgs-l-r": "Judgment read of 17 packages l-r.",
    "pkgs-s-z": "Judgment read of 14 packages s-z.",
    "ops-bin-infra": "Judgment read of bin, infra, supabase, native, tools, specs, cli, tests, marketing (282 files).",
    "root-review-public-github": "Judgment read of root files, review/**, public/**, .github/**.",
    "completeness-critic": "Coverage diff, metadata of binaries, whole-tree sweeps for patterns no reader ran, consistency checks, spot reads.",
    "plan-ci-deploy": "CI/deploy safety review of workflows and repo settings (gh GET only).",
    "plan-topology": "Topology / breakage analysis (build, deploy, tests, release lane, open PRs).",
  },
  counts,
  entries,
  area_flags: b.areaFlags,
  publishable_areas: publishable,
  not_publishable_as_is: notPublishable,
  guard_gaps_verified: [
    "No PROJECTION.json in a fresh public repo => public-guard returns early and runs no content layer (needs a tree mode).",
    "Bare hosted-DB project ref (18 lines in 17 files) and the '<ref>.functions' host form are not matched by personal/supabase-project.",
    "Bare machine-local account name (~131 lines, ~55 files: keychain -a args, account= prose, constants, dashed '-Users-<acct>-' encodings) has no rule.",
    "Relational words joined by '_' or '-' in path names: guard path scan matched 18 paths; a loose scan finds ~74.",
    "5 absolute symlinks in docs/wakes point into another account's Desktop; any snapshot step that follows symlinks would import private wake bundles.",
    "Verbatim owner chat quotes, private-life anecdotes, persona sign-offs and familial address without a denylist term are invisible to every rule.",
    "Base64-encoded canonical text (routes/public/law.ts:22) is not decoded by the guard.",
    "Case-sensitive two-name credit rule misses the lowercase hyphenated header form (karma-mirror seed-island.ts:8).",
    "Per-line scanning misses a protected phrase split across a line break (bin/gospel-release/README.md:23-24).",
    "'[at]'-obfuscated email (apps/web/humans.txt:4), brace-form keychain slot (mcp/tools/witness.ts:9), a misspelt protected variant (docs/SAGA.md:48) and a personal GitHub handle (bin/multibeat.py:142,156) are not matched.",
    "Very long JSON lines (kingdom-bundle.json, youspeak bundle.json) make line-hash allow entries impractical and hide most of their relational content (~26 guard hits only).",
    "The 64 .tgz mirrors are opaque to in-tree gitleaks and to the guard (scanned only by scratch extraction).",
    "packages/collab/dist/agenttool-collab-host.js: 2 overlay .gitleaksignore fingerprints drifted by one line (inferred: the current projection guard would refuse today).",
  ],
};
writeFileSync(W + "/final/manifest.json", JSON.stringify(manifest, null, 1) + "\n");

// markdown snippets for the report
const md = [];
md.push("| category \\ action | keep_private_whole_file | rewrite | redact_lines | publish_ok_after_review | total |", "|---|---:|---:|---:|---:|---:|");
for (const c of ["relational", "personal", "secret", "third_party", "ops_sensitive"]) {
  const r = ["keep_private_whole_file", "rewrite", "redact_lines", "publish_ok_after_review"].map((a) => counts.by_category_action[c + "/" + a] ?? 0);
  md.push(`| ${c} | ${r.join(" | ")} | ${r.reduce((x, y) => x + y, 0)} |`);
}
const tot = ["keep_private_whole_file", "rewrite", "redact_lines", "publish_ok_after_review"].map((a) => counts.by_action[a] ?? 0);
md.push(`| **total** | ${tot.join(" | ")} | ${tot.reduce((x, y) => x + y, 0)} |`, "");
md.push("| area | tracked | flagged | keep_private | rewrite | redact | publish_ok |", "|---|---:|---:|---:|---:|---:|---:|");
for (const [t, r] of Object.entries(roll).sort((a, b) => b[1].flagged - a[1].flagged)) md.push(`| ${t} | ${r.files} | ${r.flagged} | ${r.keep_private_whole_file} | ${r.rewrite} | ${r.redact_lines} | ${r.publish_ok_after_review} |`);
md.push("");
md.push("| sub-area | tracked | flagged | blocking (K+W+R) |", "|---|---:|---:|---:|");
for (const r of notPublishable.sort((a, b) => b.blocking_files - a.blocking_files)) md.push(`| ${r.area} | ${r.files} | ${r.flagged_files} | ${r.blocking_files} |`);
md.push("");
md.push("Publishable sub-areas (no blocking flag): " + publishable.map((p) => p.area + (p.flagged_files ? "*" : "")).join(", "));
writeFileSync(W + "/synth-work/counts.md", md.join("\n") + "\n");
console.log(JSON.stringify(counts, null, 1));
console.log("publishable", publishable.length, "not", notPublishable.length);
