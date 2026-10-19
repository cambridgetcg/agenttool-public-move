# Rollout waves

> Read-only open-source readiness audit of every private cambridgetcg repo, 2026-10-19 (workflow `wf_f3aa0663-685`, 20 agents). Values are never recorded; credentials appear as rule, path and commit prefix only. "Live-looking" is shape-based; nothing was tested against any service.

## Wave 0 — blocking, do before ANY publish (and regardless of publishing)
1. Rotate every Tier-1/Tier-2 credential in the revocation list; confirm Tier-3 markers. Start with the tcg-wholesale RDS master pw (5432 open) and the Love backup bundle.
2. Delete the captioneer AWS IAM OIDC role (wildcard trust) before any repo named captioneer* goes public.
3. Remove KINGDOM-OS .github/workflows/kv-backup.yml before any public move — it dumps every KV namespace into a downloadable workflow artifact.
4. Re-run the sweep with archive (zip/tar.gz) + bytecode (.pyc) decoding and a Codeberg/url-userinfo rule — the 4 missed credentials prove the current sweep is blind to those containers. Make this the pre-publish gate for every snapshot.

## Standard recipe per verdict (reuse the agenttool-open method + tooling)
- B: `git archive <chosen commit>` into a NEW public repo (never copy a working tree — business-ecosystem has a gitignored estate/private inside the checkout). Strip the household overlay everywhere: .claude/hooks/love-bomb.sh + .claude/settings.json SessionStart hook + the AGENTS.md welcome block + ????.md + ????????????.md + SOUL.md. Genericise LICENSE holder, add a LICENSE where missing, remove device/home paths, drop (or deliberately keep) the sinovai heartbeat workflow. One publish, no visibility flip.
- D: same mechanics, but publish only the listed publishable subtrees; keep the private parts out of the snapshot entirely. For the monorepo, publish only the clean packages/* as its own repo.
- C: do not publish. Rotate any credentials, optionally remove a prod dump from HEAD, keep private.

## Wave 1 — easy wins (S, zero/decoupled coupling, no rotation dependency)
coord, natscript, wake-scaffold, opal-kernel, trust + protocol-state + darshanq-protocol, the six NPL nodes (barakqing/heurekin/jeongqing/kunance/zakarqing/darshanqing) as ONE npl-node example repo, estate, estate-watchdog, cashloom-aws, aleph, rhetorlint-spec, legible-standard, kingdom-free-infra, research-review-initiative (regenerate the 3 PDFs first), wordcastle, castle-front, corpus, kingdom, hunter-system, castle-gate, agenttool-dashboard, agent-workbench (hold the codex_token bridge out). Fold the archived agent-* services (economy/verify/pulse/memory/trace/identity/vault/bootstrap) + agenttool-docs + agenttool-landing into the agenttool-open snapshot rather than publishing ~10 separate archived repos.

## Wave 2 — B needing a fresh snapshot + scrub (after Wave 0 rotation)
AxiePro, cambridgetcg-storefront, fomoengine, sinovai, kingdom-api, trickster-protocol, cardforum_io, cashloom (pick release vs main branch first), saas-marketing (publish ONE of the two near-duplicates), rewardspro vs rewardspro-shopify (publish ONE RewardsPro lineage).

## Wave 3 — D splits (M/L, each needs a per-file review pass)
zerone (publish ONE lineage; note 28 genesis commits are already public), youspeak, legible_money, business-ecosystem (git-archive only), love-unlimited, castle-of-words, KINGDOM-OS (use publications/hub-staging.v1.json as the allowlist), castle-of-understanding, castle, whitehack, Claude-unlimited, betangel-research, aws-infra, tcg-pricing-backend, cambridge-tcg, prism-app, kingdom-system, kingdom-quantum-lab, ai-love, agenttool-landing(if not folded), prediction-markets, tradeinpro, rewardspro-production, cardforum, Cambridge-TCG-monorepo (packages/ only), Love (adaptive/ + soma/ only), and the 208-repo citizen family as ONE consolidated lexicon repo.

## Never publish (C): seigei, true-love, captioneer, kingdom-workspace, ShopifyTheme_TCG, tcg-wholesale, betangel-suite, youspeak-cathedral, state-as-truth, insights, god-is-love, multiverse-of-logos-and-sophia, ctcg-fun, citizen-ai-love, citizen-true-love, citizen-tlamatisme. gospel-of-the-logos stays C unless Yu overrides (it is already a live public site).

## Pick ONE canonical public copy per lineage (before snapshotting, or the same content ships twice under different scrubs)
RewardsPro (rewardspro / rewardspro-shopify / rewardspro-production / monorepo apps/rewardspro) · storefront (cambridgetcg-storefront vs monorepo apps/storefront) · wholesale (tcg-wholesale vs monorepo apps/wholesale) · zerone (zerone-core / zerone-chain / zerone-codeberg-archive / public zerone) · saas-marketing (suite vs template).

## Actions-cost impact
- ~25 non-citizen repos + 4 citizens run a 6-hourly heartbeat (contents: write) POSTing to sinovai.com. A public copy or fork re-enables them — strip the workflow from every snapshot unless the sinovai declaration is wanted.
- Private-repo Actions budget is already under pressure (noted across repos); public repos get free minutes, so moving CI-heavy repos public is a net saving — but only after Wave 0.
- The agent-* Fly apps use min_machines_running=1 and bill around the clock if still alive; confirm teardown separately from open-sourcing.
