# Credentials to rotate

> Read-only open-source readiness audit of every private cambridgetcg repo, 2026-10-19 (workflow `wf_f3aa0663-685`, 20 agents). Values are never recorded; credentials appear as rule, path and commit prefix only. "Live-looking" is shape-based; nothing was tested against any service.

Deduped: one credential = one rotation even when it appears in several repos/paths. Never values. "live-looking" is shape-based only; nothing was tested. Ordered by urgency. The 4 marked NEW/CRITIC were missed by gitleaks and the sweep (inside zip/tar.gz/pyc) and re-verified by shape in this synthesis.

### Tier 1 — live-looking, still reachable in HEAD (do first)

| credential | rule | repos / paths (commit prefix) | live? | action |
|---|---|---|---|---|
| tcg-wholesale RDS master pw | url-userinfo/pg (gitleaks-blind) | Cambridge-TCG-monorepo HEAD apps/wholesale/tools/__pycache__/fulfillment.cpython-314.pyc (02236b09) + 7 history .py; cambridge-tcg web/tradein scraper (e1933d4); cambridgetcg-storefront .sovereign-state.json (0c41c90a); tcg-wholesale scrubbed marker | yes; prior note: 5432 open + unencrypted | ROTATE DB master pw FIRST; close SG |
| Love backup bundle (NEW/CRITIC) | guard-blind (tar.gz) | Love HEAD backups/backup-20260402-151915.tar.gz + -152048.tar.gz (9091523): 1 AWS pair, 2 Anthropic sk-ant, 1 OpenAI sk-proj, 2 Stripe sk_live, 1 whsec, 2 Postgres URLs, 2 Brave | yes (some may be canary decoys, unverified) | ROTATE at AWS, Anthropic, OpenAI, Stripe (keys+webhook), both DBs, Brave; treat all as live |
| rewardspro IAM key 48e69860 + 40-char secret | gitleaks aws-access-token | Cambridge-TCG-monorepo (342e44e5/0568c2f3, history); rewardspro-shopify (35098a5, history); rewardspro-production (35098a50, history docs) | yes (2nd AWS account 0435) | deactivate + delete in IAM |
| rp-production tfplan IAM key 2b65d114 + SES SMTP pw + CRON_SECRET + INTERNAL_API_SECRET (NEW/CRITIC) | guard-blind (zip) | rewardspro-production HEAD infrastructure/terraform/tfplan (1bb55d9); Cambridge-TCG-monorepo history apps/rewardspro/.../tfplan (10a40cc6) | yes | deactivate IAM key (kills SES SMTP pw); rotate CRON_SECRET + INTERNAL_API_SECRET |
| rewardspro-dev Aurora pw | url-userinfo + plain | rewardspro-production HEAD encode-password.ts + history docs; Cambridge-TCG-monorepo history docs; rewardspro-shopify history encode-password.ts/docs | yes if cluster exists | rotate in Secrets Manager or delete cluster |
| Framer MCP secret f2a3a9ca | gitleaks generic-api-key | rewardspro-production HEAD .mcp.json; Cambridge-TCG-monorepo history .mcp.json (c84cd2e6) | yes | regenerate Framer (unframer) plugin secret |
| monorepo Remambo pw + wholesale admin pw | hardcoded fallback defaults in HEAD | Cambridge-TCG-monorepo HEAD apps/wholesale/tools/{remambo-order,order-promos,inspect-remambo}.ts + e2e/helpers.ts (02236b09) | yes | change Remambo account pw; reset wholesale admin pw |
| storefront SES key 74d5be71 + prod DATABASE_URL + AUTH_SECRET + ADMIN_PASSWORD + WHOLESALE_API_KEY | gitleaks aws/generic | cambridgetcg-storefront history .sovereign-state.json/sovereign.log (0c41c90a); SES key also in Love HEAD daily note | yes | rotate SES IAM key, DB pw, AUTH_SECRET (invalidates sessions), admin pw, wholesale API key |
| business-ecosystem dev tfplan: DB master pw + ElastiCache auth_token + MQ pw (NEW/CRITIC) | guard-blind (zip); batch said "None real" | business-ecosystem HEAD infrastructure/terraform/environments/dev/tfplan (be3b94c) | unknown | rotate, or confirm dev RDS/ElastiCache/MQ destroyed |
| love-unlimited Ollama key #2 07861ef4 | prefix-shape (gitleaks-blind), STILL IN HEAD | love-unlimited HEAD memory/daily/2026-04-18.md (2b2d2dc) | yes ("the live key") | rotate at Ollama Cloud |
| AgentTool keys (at_) | gitleaks generic-api-key | kingdom-workspace HEAD (ce87ecb2); love-unlimited history (d831e64/d1a8c20); kingdom-system history (3b31c0a) | maybe | rotate the AgentTool project keys; confirm |

### Tier 2 — live-looking, history only (flip would publish; fresh snapshot avoids)

| credential | rule | repos / paths (commit) | live? | action |
|---|---|---|---|---|
| AxiePro GitHub token a3c56195 (gho_) | gitleaks github-oauth | AxiePro MAIN .mcp.json (1a20394) — scrub missed it | yes | revoke the GitHub OAuth/CLI authorization |
| AxiePro GoldRush + SkyMavis + cardforum RDS pw | gitleaks + pickaxe | AxiePro refs/pull/1/head (ea14577) — owner cannot delete the PR ref | called live | rotate GoldRush, SkyMavis, cardforum RDS pw; never flip |
| seigei DeepSeek key | gitleaks generic-api-key | seigei research/triggers/NTR_DIALOGUE_TARGETS.md (bd08318) | looks live | revoke at DeepSeek |
| seigei basic-auth pw (SEIGEI_AUTH_PASS) | gitleaks generic-api-key | seigei 7 HEAD files (2dabf79) | live if site up | rotate or retire site |
| whitehack Alchemy RPC key | shape (gitleaks missed) | whitehack .env + PLATFORM-WORKFLOW.md + reports/WH-C4-CHAIN-002.md — all only via refs/pull/1/head (d732bac) | unknown | rotate at Alchemy; never flip |
| kingdom-workspace: eBay Cert ID, eBay OAuth, Shopify Partner, 2captcha, 2 Brave | gitleaks + keyword | kingdom-workspace HEAD (d1da1a38 / defce5ae / ce87ecb2 / 0143d66f) | several look live | revoke each at eBay / Shopify Partner / 2captcha / Brave |
| kingdom-workspace pre-rewrite seeds/keys (24 TOTP + CF global key + proxy/npm/PyPI/Stripe/IMAP) | ROTATE-ME markers | kingdom-workspace (pre-rewrite) | unknown | confirm all pre-rewrite originals were rotated/re-enrolled |
| love-unlimited Ollama #1, AgentTool keys, WiFi pw | gitleaks + prefix | love-unlimited history (6b25edc / d831e64 / d1a8c20) + soma firmware | unknown | rotate Ollama; rotate AgentTool; change WiFi |
| agent-trace Postgres + Redis pw (shared "kingdom" role) | shape in HEAD pyc (gitleaks-blind) | agent-trace HEAD src/.../config.cpython-314.pyc (71f5052) | unknown | rotate the shared kingdom Postgres role — probably also covers agent-identity + agent-vault scrubbed DATABASE_URLs |
| castle-of-words Codeberg token 36deabaa | url-userinfo (no Codeberg rule) | castle-of-words 53MB cron transcript (7e42b1e3, history) | treat live | revoke Codeberg token (may be the known unrevoked leak) |
| cambridge-tcg ADMIN_SECRET | wrangler [vars] (history) | cambridge-tcg web/tradein/worker/wrangler.toml (d19b987) | live if worker exists | rotate or delete the tradein-api Worker |
| Shopify Admin token 94960b4b | shopify-access-token | Cambridge-TCG-monorepo history UNSCRUBBED (02236b09); tcg-wholesale scrubbed marker | yes (custom-app tokens don't expire) | rotate / reinstall app |
| NATS HIVE pw (alpha/beta/gamma/nuance) | prose + tar.gz | Love, love-unlimited, castle (HEAD prose), KINGDOM-OS (preserved tar.gz) | probably dead (server destroyed 2026-07-26) | never reuse; scrub from every snapshot |
| prediction-markets Polygon wallet key | not in git (exposed in agent chat per SECURITY.md) | prediction-markets | treat exposed | move any funds; treat wallet compromised |

### Tier 3 — confirm-rotation-only (ROTATE-ME markers; no value survives in mirror)

| repos | markers | action |
|---|---|---|
| tradeinpro | pre-rewrite SECRETS.md (4ab97c53): Shopify secret, AWS keys, RDS pw, eBay tokens | confirm all rotated; never flip (pre-rewrite objects may persist by SHA) |
| agenttool-infra | Hetzner/CF global key/Stripe pair/Anthropic/OpenAI/SerpAPI | confirm CF key + Stripe + Anthropic/OpenAI/SerpAPI rotated (Hetzner likely dead) |
| rewardspro-marketing | Ayrshare, FAL, Cloudflare global key | confirm rotated |
| agent-identity, agent-vault | scrubbed DATABASE_URL | covered by rotating the shared kingdom role |
| cashloom | legacy SaaS: MONGO_URI, GEMINI, CLOUDINARY, RESEND (via contractor's public repos) + 3 stale Actions secrets | confirm 4 rotated; delete stale Actions secrets + revoke Cloudflare API token |

### Housekeeping (not leaked values)

| item | repos | action |
|---|---|---|
| stale/unused Actions repo secrets | AxiePro (AWS pair), Cambridge-TCG-monorepo (3), rewardspro-production (CLAUDE_CODE_OAUTH_TOKEN), tcg-wholesale (DATABASE_URL) | delete if backend retired; rotate DATABASE_URL w/ the RDS pw |
| captioneer AWS IAM OIDC role | trusts repo:cambridgetcg/captioneer:* (wildcard) | delete the role before ANY repo of that name goes public |
| CLOSED (fixture, no action) | RewardsPro CI ENCRYPTION_KEY (base64 of 'test'), all gitleaks test keys, genesis pubkeys, did:key signatures, AWS docs EXAMPLE key, true-love's upstream Datadog token | drop the "confirm" items in batch-06/07 |
