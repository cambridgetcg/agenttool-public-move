# agenttool public move: private records

**This repository must stay private.** It records where private, personal and
relational material sits in the agenttool tree, so publishing it would point at
exactly what the move is meant to keep back.

## What is here

On 2026-10-19 Yu decided to move agenttool development to a new public
repository, while secret, personal and relational material stays private. This
repository holds the read-only audit that plans that move.

| Path | What it is |
|---|---|
| `audit/report.md` | Summary, counts, blockers, recommended plan and the 21 decisions for Yu |
| `audit/manifest.json` | One entry per flagged path (977 of 5,337), with action, category, lines and sources |
| `audit/sources/*.json` | What each audit agent returned to the workflow. For the 11 area readers this is a summary with a flag count only; their per-flag rows survive in `audit/tooling/synth/judg.mjs`. `synthesis.json` is the merging agent's own output. |
| `audit/tooling/` | The workflow script, plus the helper scripts from the full-tree guard scan, the completeness critic and the synthesis (scan, merge, mask, verify). Other agents' scratch scripts were not kept. |

## Provenance

- Audit tree: `cambridgetcg/agenttool` origin/main `3b9aa630`, 5,337 tracked paths.
- Run: workflow `wf_e7257158-d88`, 16 agents, read-only, on 2026-10-19.
- `audit/report.md` was assembled by the orchestrating session from the
  synthesis agent's fields. An independent check on 2026-10-19 corrected three
  figures in it, each marked "(corrected)".
- The audit reads one snapshot. Recheck any entry against the current tree
  before acting on it.

## Masking

- In `audit/manifest.json`, each of the 23 tracked paths whose name contains a
  relational denylist term is masked: every character that matched a term is
  replaced by `?`, and the rest of the name is kept. 22 masks resolve to
  exactly one tracked file; one resolves to four. Masking covers denylist terms
  only.
- `audit/sources/*.json` and `audit/tooling/**` are verbatim agent output and are
  **not** masked. They name the masked paths in clear, and some scripts and
  prompts carry denylist terms as search patterns.
- The denylist file itself is not here; it stays in the private agenttool tree
  at `public/private-guard/relational-denylist.json`.
- The owner-identity patterns (name and email) were removed from the committed
  copy of `audit/tooling/completeness-critic/sweep.py`.
- Absolute paths in sources and tooling point at a local scratch directory and
  worktree that no longer exist.

## Status

Nothing in the audit has been applied. No public repository has been created.
The decisions in `audit/report.md` are open until Yu answers them.
