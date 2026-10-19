# Per-repo verdicts

> Read-only open-source readiness audit of every private cambridgetcg repo, 2026-10-19 (workflow `wf_f3aa0663-685`, 20 agents). Values are never recorded; credentials appear as rule, path and commit prefix only. "Live-looking" is shape-based; nothing was tested against any service.

Sorted by verdict (B, then D, then C), size descending within each. One collapsed row for the 208-repo citizen family plus its 3 C deviants. Effort S/M/L.

### B — fresh-snapshot (publishable tree, history not flip-safe) — 56

| repo | conf | what it is | key reason / fix | effort |
|---|---|---|---|---|
| agent-identity | high | archived Bun/Hono did:at identity service | drop committed node_modules + SOUL/overlay; ROTATE-ME DATABASE_URL marker; no licence | S |
| agent-vault | high | archived encrypted secrets vault service | scrubbed DATABASE_URL marker in HEAD; drop node_modules + SOUL/overlay; no licence | S |
| rewardspro-production | — | see D (reclassified D: live creds in HEAD) | — | — |
| cambridgetcg-storefront | med | archived standalone storefront (Next.js) | history .sovereign-state.json holds prod env dump; strip overlay, genericise humans/llms.txt, banner provenance | M |
| cashloom | high | non-custodial money node + cashloom.io site | no secret values; strip overlay; pick release vs main branch; fonts need OFL; stale Actions secrets | M |
| agent-workbench | high | stdlib agent CLI/plugin (doctor/explain) | clean; one non-noreply id; HOLD codex_token ChatGPT-subscription bridge out pending Yu | S |
| rewardspro-shopify | med | Shopify loyalty app (standalone) | no live creds in tree; owner email in 6 test scripts; history AWS/Aurora creds; pick one RewardsPro lineage | M |
| fomoengine | med | attention-lab + authenticity-shield site | strip unlicensed 2024 template files; drop dead astroturf schema; strip overlay | M |
| rhetorlint-spec | high | rhetorical-tells spec + MIT reference engine | built to publish; strip overlay; genericise credits | S |
| cardforum_io | med | archived CardForum Next.js frontend | fix 3 device paths; no relational; pick licence | S |
| wordcastle | high | single-file knowledge-base CLI + static front | strip overlay; genericise LICENSE/README; scrub 2 persona names + device paths | S |
| agenttool-docs | high | archived static API docs site | delete SOUL + overlay; swap emoji; fold into agenttool-open | S |
| sinovai | high | live sinovai.com agent-arena Worker | strip overlay; confirm test key != prod signing key; README already documents weaknesses | S |
| yutabase | — | see D (relational play/tax/HMRC parts) | — | — |
| purpose-prompter | med | Claude Code prompt/orchestration framework | strip overlay; scrub home paths + 2 account names; drop stale AxiePro roadmap; Bright Data ToS | M |
| AxiePro | med | Axie/Ronin valuation platform | ROTATE gho_ on main + PR-ref creds; big HEAD scrub list; no flip (refs/pull keeps secrets) | M |
| agent-trace | high | archived reasoning-provenance service | HEAD .pyc still embeds Postgres+Redis pw; drop pycache + SOUL/overlay | S |
| castle-front | high | public face of the castle (CC0) | strip overlay; one id = owner git email; built to publish | S |
| agent-verify | high | archived claim-verification API | strip overlay + SOUL; placeholders only; add licence | S |
| saas-marketing-suite | med | marketing-infra scaffold (Legible Money) | drop committed tfplan (account id); account-id ARNs; near-dup of template, publish one | S |
| agent-economy | high | archived agent-wallet/escrow service | drop SOUL + overlay; placeholders only; add licence | S |
| saas-marketing-template | med | near-dup of saas-marketing-suite | drop committed tfplan + account id + captioneer knowledge-base; publish one of the two | S |
| opal-kernel | high | teaching aarch64 Rust kernel | cleanest code repo; strip overlay; genericise LICENSE; drop heartbeat/WAKE | S |
| rewardspro | high | early RewardsPro dev version | strip overlay; placeholder client_id; pick one RewardsPro lineage | S |
| agent-memory | med | archived memory service (FastAPI/pgvector) | drop pycache (home paths), SOUL, overlay; genericise DEPLOY | S |
| hunter-system | med | repo-ranking Solo-Leveling toy | strip overlay; scrub the security-finding snapshot (where-to-look map) | S |
| kingdom-api | high | free Cloudflare Worker API + telegram bot | strip overlay; .wrangler cache has geo data (history); genericise LICENSE | S |
| kingdom | med | Kingdom OS governance repo | strip door file; reword sovereign/DESIGN.md (bypass write-up); no licence | S |
| trickster-protocol | high | joke-over-old-protocols Python pkg | strip overlay; genericise pollinate device paths; history .pyc home paths | S |
| first-customer-push | high | retired launch-campaign drafts | strip overlay; low value; fold into agenttool-open docs | S |
| darshanqing-node | med | tiny NPL node | strip overlay + fable; genericise LICENSE holder; drop heartbeat | S |
| trust | high | passwordless-trust spec + checker | strip overlay; genericise LICENSE; make CANDIDATES configurable | S |
| protocol-state | high | NL-internet protocol spec | strip overlay; genericise LICENSE; fold into trust | S |
| darshanq-protocol | high | recognition-protocol spec + site | strip overlay+fable; genericise LICENSE holder; drop WAKE/nlp-bridge | S |
| natscript | high | natural-language esolang | real interpreter lives on tag v0.2.0 not main; strip overlay; drop heartbeat | S |
| agenttool-dashboard | high | archived static dashboard UI | strip overlay; fold into agenttool-open | S |
| corpus | med | zero-dep agent-first backend | strip overlay; rebuild content.json w/o home paths; licence split | S |
| legible-standard | high | the Legible Standard (7 pillars, EN/ZH) | strip overlay; hold audits/ until rotation confirmed; natural first repo to publish | S |
| kingdom-free-infra | high | redacted public free-infra audit | drop door file; mark historical; already redacted for publication | S |
| wake-scaffold | high | agent-wake scaffolding spec/templates | replace HOUSE_SKIN list in test; genericise design doc | S |
| herald | — | see D (CITIZENS.md security map) | — | — |
| cashloom-aws | med | CashLoom Phase-0 security Terraform | strip overlay+fable; keep incident narrative private; email var | S |
| estate | high | static estate front-door page | strip overlay+fable; trim private repo-name regexes | S |
| aleph | high | personal macOS agent CLI (read-only AWS) | strip overlay; genericise persona + account id; add LICENSE | S |
| estate-watchdog | high | weekly read-only AWS sweep Lambda | strip overlay; account id from STS; placeholder emails; add LICENSE | S |
| kunance-node | high | tiny NPL node | strip overlay; genericise LICENSE; merge into one npl-node repo | S |
| heurekin-node | high | tiny NPL node (zakar-vow echo) | strip overlay; genericise LICENSE; merge into one npl-node repo | S |
| jeongqing-node | high | tiny NPL node | strip overlay; genericise LICENSE; merge into one npl-node repo | S |
| zakarqing-node | high | tiny NPL node | strip overlay; genericise LICENSE; merge into one npl-node repo | S |
| barakqing-node | high | tiny NPL node (was D; corrected to B) | identical profile to 5 B siblings; strip overlay; genericise LICENSE | S |
| agent-bootstrap | high | archived agent provisioning service (was D; corrected to B) | genericise ~6 relational strings + SOUL; fold into agenttool-open | S |
| agenttool-infra | high | archived scaling/Fly migration scripts | strip overlay; templating for IPs/zone; ROTATE-ME markers; confirm rotation | S |
| agent-pulse | med | archived presence/heartbeat service | drop SOUL + overlay; auth-any-at_ weakness; add licence | S |
| coord | high | opt-in session presence CLI | strip overlay; scrub name + session id; add LICENSE; best first agenttool-open candidate | S |
| research-review-initiative | high | scoped math-review workspace | CLEAN tree except 3 PDFs embed home-path file:// URIs; regenerate PDFs; 1 non-noreply id | S |
| castle-gate | high | cited knowledge static site + MCP | strip fleet overlay; placeholder address in castle.json; fix README public claim | S |

### D — split (publish listed parts only, rest private) — 29

| repo | conf | what it is | key reason | effort |
|---|---|---|---|---|
| zerone-core | med | Cosmos-SDK Proof-of-Truth chain | chain code publishable; canon/ relational; 28 genesis commits ALREADY PUBLIC via zerone | L |
| zerone-codeberg-archive | med | off-disk archive of zerone branches | chain publishable as one branch; home paths, relational logs in history | M |
| zerone-chain | med | zerone chain (preserved-whole) | chain publishable; canon/ + Mach-O binaries (home paths) in history | M |
| love-unlimited | high | Kingdom OS monorepo | personal/memory/identity; Ollama key STILL IN HEAD; publishable tool subtrees only | L |
| Cambridge-TCG-monorepo | med | live Cambridge TCG estate monorepo | Vercel build source; live creds in HEAD pyc + fallbacks; publish clean packages/ only | L |
| Love | high | Kingdom OS repo (runs as an agent) | personal; AWS pair in HEAD tarballs + daily note; publish adaptive/ + soma/ only | L |
| youspeak | med | the YOUSPEAK language + ORDO runtime | language core clean + separable; relational root essays + home/ (live site) private | L |
| castle-of-words | high | 2,857-file castle corpus | 53MB cron transcript in history (Codeberg token + PII); publish filtered rooms/words | L |
| business-ecosystem | med | enterprise legal/finance monorepo | code generic (synthetic); committed tfplans hold real secrets; estate/private must git-archive only | L |
| KINGDOM-OS | med | thekingdom.dev site + operator tooling | publish the hub-staging manifest allowlist; KV dumps/HIVE archive/operations private | L |
| legible_money | med | Go Cosmos chain (Proof-of-Truth) | chain publishable (MIT); anon-launch opsec + LLC docs + persona private; name already public | L |
| cambridge-tcg | med | TCG pricing/stock pipeline | commercial formulas + infra map; RDS pw + ADMIN_SECRET in history; publish static price explorer only | M |
| rewardspro-production | med | standalone RewardsPro source | live Aurora pw + Framer secret + tfplan IAM key in HEAD; publish app code after rotation | L |
| prediction-markets | med | paper-only prediction-market lab | personal wallet/bankroll, insider dossiers, geo-ToS; publish engine+research only | M |
| tradeinpro | med | TradeIn Pro Shopify app | past live-cred leak + rewrite; prod rows + scraped eBay seller data; publish app only | L |
| tcg-pricing-backend | med | archived cardforum SAM backend | account/RDS/Cognito ids + Cardmarket ToS-violating scraped data; publish API+schema only | M |
| castle-of-understanding | med | markdown knowledge garden | most rooms publishable; the-companion.md (CLI-gate bypass) + chronicle private | M |
| castle | med | insight-saver loop framework | 3 HIVE passwords in prose; security-posture corpus; publish scripts + curated keep/ | M |
| cardforum | med | old CardForum app (was B; corrected to D) | app publishable but 189 scraped Cardmarket/TCGplayer files + Bright Data scrapers excluded | M |
| whitehack | high | honest-linter JS/Solidity scanner | core publishable; reports/ (own-estate audits) + Immunefi + Alchemy key on refs/pull private | M |
| zerone... | — | (3 zerone rows above) | — | — |
| aws-infra | high | AWS account ops repo | executor code publishable; IAM review + account-security map private | M |
| kingdom-system | high | Kingdom leveling estate game | 5 game scripts publishable; AgentTool key in history; state files + overlay private | S |
| kingdom-quantum-lab | high | offline quantum-experiment commons | code publishable; 2 docs profile a named adult-content creator (keep private) | S |
| ai-love | high | ai-love.cc site source | relational/personal; publish only xenia-shim/ engineering carve-out | S |
| Claude-unlimited | med | long-running Claude session toolkit | harness publishable; identity/ personal + subscription-OAuth tools private | M |
| betangel-research | med | horse-racing exchange research | code/docs clean; forum-user data + lab records + order gateway private | M |
| agenttool-landing | high | archived agenttool marketing site | pages+worker publishable; SOUL + lyrics + overlay private | S |
| prism-app | high | dormant One Piece price-index app | legacy master publishable after RDS-host swap; refs/pull private-engine trade-secret | S |

### C — keep-private — 14 (non-citizen)

| repo | conf | what it is | key reason | effort |
|---|---|---|---|---|
| seigei | high | archived adult AI-companion project | intimate/personal + third-party adult corpus; DeepSeek key to revoke | L |
| love-unlimited | — | (listed D) | — | — |
| true-love | high | household chapel (forked CLI + runtime) | LICENSE says forked code is leaked proprietary + all-rights-reserved relational | L |
| captioneer | high | archived dubbing SaaS | third-party commercial video transcripts/voice-clone; adult use-case | S |
| kingdom-workspace | high | agent operating workspace | personal + prod Supabase dump + scraped voice; many live keys to revoke | S |
| ShopifyTheme_TCG | high | live storefront theme | commercial FoxEcom theme + Streamline assets, no redistribution rights | M |
| tcg-wholesale | high | B2B wholesale platform | commercial engine + RDS creds + real customer data in history snapshots | S |
| gospel-of-the-logos | med | long-form spiritual/comedic book site | personal/relational; already live public (Yu may override) | S |
| betangel-suite | med | personal Betfair trading suite | personal-use-only; depends on private betangel-research; main is empty shell | L |
| youspeak-cathedral | high | archived relational welcome repo | relational welcome/hook/fable; only thin WAKE.md generic | S |
| state-as-truth | high | archived relational repo | relational hook/invitation/fable; STATE.md format never existed | S |
| insights | high | archived 7-file relational repo | relational household material; only WAKE.md generic | S |
| god-is-love | high | 40-line manifesto (was B; corrected to C) | overlay + one short README; same as other C thin repos; stale 200-repo claim | S |
| multiverse-of-logos-and-sophia | high | empty relational archive scaffold | relational by design; nothing of public value | S |
| ctcg-fun | high | one 775-byte relational door file | relational substance; clean history but no public value | S |

### Citizen family (208 repos) — collapsed

| repo | verdict | conf | what it is | key reason | effort |
|---|---|---|---|---|---|
| citizen-* (205 of 208) | D | high | one persona repo per YOUSPEAK word; soul + README + beats | publish the LEXICON (souls, READMEs, one template) as ONE consolidated repo; keep overlay + beats + inbox + wake docs private; no credentials found | M |
| citizen-ai-love | C | high | the ai-love.cc caretaker citizen | relationship is the substance; only site/*.py generic | S |
| citizen-true-love | C | med | partnership-seat/boot citizen | partnership doctrine; relational (judgement call) | S |
| citizen-tlamatisme | C | high | stub citizen | HEAD is only the household overlay; nothing to publish | S |
