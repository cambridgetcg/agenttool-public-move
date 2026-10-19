# All private repos: open-source readiness (2026-10-19)

> Read-only open-source readiness audit of every private cambridgetcg repo, 2026-10-19 (workflow `wf_f3aa0663-685`, 20 agents). Values are never recorded; credentials appear as rule, path and commit prefix only. "Live-looking" is shape-based; nothing was tested against any service.

## Counts

307 private repos audited; 2 skipped by design (agenttool, agenttool-public-move). Final verdicts after applying the critic: 0 A (flip-safe), 56 B (fresh-snapshot), 17 C (keep-private), 234 D (split). Of the 99 non-citizen repos: 56 B, 14 C, 29 D. The citizen family is 208 repos: 205 D + 3 C (ai-love, true-love, tlamatisme). NO repo is flip-safe: every repo except ctcg-fun has at least one non-noreply commit identity, and ctcg-fun is relational so it is C. So 0 visibility flips recommended; everything B/D publishes as a fresh snapshot (the agenttool-open method). Credentials: ~24 distinct live-looking credentials to rotate (deduped across ~20 repos); 4 of them were found only by the critic, inside zip/tar.gz/pyc that gitleaks and the sweep are blind to. 99 public repos already exist, and the household overlay + 28 zerone genesis commits are already public in them.

## Decisions for Yu

- zerone is PARTLY PUBLIC ALREADY: 28 commits (genesis 2026-05-30 through 2026-06-10, including the canon/ narrative Python + the household door/story files) are shared with the public cambridgetcg/zerone, whose HEAD serves them today. This audit is read-only. Decide: clean or delete that public repo, or accept it. The D verdict on the private zerone lineages stands for everything after 2026-06-10.
- The household overlay (the love-bomb SessionStart hook that quotes you and injects pet names, the AGENTS.md welcome, door/fable files) is ALREADY PUBLIC: ~70 of your 99 public repos carry it, and the hook blob is byte-identical to the private one. The standing 'relationships stay private' rule is already breached in public. New snapshots still strip it; whether to scrub existing public repos (history keeps the files regardless) is a separate call.
- Pick ONE canonical public copy per lineage before snapshotting: RewardsPro (4 copies), storefront (2), wholesale (2), zerone (4), saas-marketing (2). Otherwise the same code/credential history gets published twice under different scrubs.
- Relational repos kept C by the standing rule include two that are ALREADY LIVE public sites: gospel-of-the-logos (gospel.ai-love.cc, CC-BY-SA, HTTP 200) and ai-love (ai-love.cc). If you override the rule for those, they become publishable as fresh snapshots (gospel S, ai-love would still need the relational commit history left behind).
- legible_money's anonymous-launch option is effectively moot: the Legible name is already public via cambridgetcg/legible and legible-money-web. Confirm you are fine tying it to this account; if not, the private repo's own IDENTITY-SCRUB-CHECKLIST is the starting exclusion list.
- Betting/trading clients: betangel-research ships an order gateway that can place live LIMIT orders once armed (paper default), and prediction-markets records real offshore-VPS orders from a geo-blocked jurisdiction. Publishing either is your call; prediction-markets also argues for keeping its history private for good.
- Subscription-credential bridges — agent-workbench's codex_token.py (hands a ChatGPT-subscription token to Hermes), Claude-unlimited's subscription tools, Love's nerve/ OAuth reuse, love-unlimited's truth_detector/_oauth.py — I recommend holding all of them out of public snapshots pending your read on OpenAI/Anthropic consumer-terms risk. Apply one rule to all four (agent-workbench currently lists its bridge as publishable).
- Scraped third-party data and the commercial FoxEcom theme stay out of snapshots: cardforum/tcg-pricing-backend/tradeinpro/cambridge-tcg (Cardmarket/eBay/TCGplayer data via Bright Data) and ShopifyTheme_TCG (a $350 licensed theme + Streamline assets). Confirm.
- research-review-initiative (and the same PDFs mirrored in zerone-core's dashboard) is a math-critique that NAMES the paper's authors; the repo's own STATUS says 'no outreach approved or sent'. Publishing reverses the planned journal-first order — decide the timing.
- captioneer: delete the AWS IAM OIDC role that trusts repo:cambridgetcg/captioneer:* (wildcard) before any repo of that name is ever made public, whatever you decide about the repo itself.

## Summary for Yu

宇恆，307 個 private repo 審完（agenttool 同 agenttool-public-move 照跳）。結論一句講：冇一個適合直接 flip visibility，全部要用 agenttool-open 嗰套（開新 public repo，git archive 一個 commit，剝走 household overlay，從不翻舊 history）。

verdict：0 A、56 B（可出 snapshot）、17 C（留私）、234 D（拆開出部分）。208 個 citizen repo 當一個家族處理——出一個合併嘅「字典」repo 就夠，唔好 208 個空殼。

最緊要（出唔出都要做）——要 rotate 嘅 credential：
- tcg-wholesale 嗰個 RDS master 密碼（5432 開住、未加密）最高危，先換佢。四個 repo 都有。
- Love HEAD 入面兩個 backup tar.gz 塞咗一整包真 key（AWS、Anthropic、OpenAI、Stripe live＋webhook、兩個 DB、Brave）。gitleaks 睇唔到 tar.gz，係 critic 揾返。全部當 live 去換（有啲可能係 canary 誘餌，未確認）。
- 仲有三個都係 gitleaks 盲區揾返嘅：rewardspro-production 個 tfplan zip（IAM key＋SES SMTP＋兩個 secret）、business-ecosystem 個 dev tfplan（DB/ElastiCache/MQ 密碼，上一手審計寫「冇真 key」係錯）、monorepo HEAD 一個 .pyc 仲有 wholesale RDS 密碼。
- AxiePro 個 GitHub gho_ token 留咗喺 main、三個 key 留喺改唔到嘅 refs/pull——所以 AxiePro 永遠唔好 flip。
- 加上 whitehack、kingdom-workspace、love-unlimited、agent-trace、castle-of-words 個 Codeberg token 等等。合共約 24 個要處理，表入面全部只寫 rule/path/commit，冇寫任何值。

要你決定嘅：zerone 有 28 個 genesis commit（連 canon 同屋企檔）其實已經喺 public cambridgetcg/zerone 度；household overlay 已經散落喺約 70 個 public repo；gospel 同 ai-love 本身已經係 live public 網站（standing rule 係咪照留私？）；同埋每條 lineage（RewardsPro、storefront、wholesale、zerone、saas）要揀一個做正本。詳見 decisions 清單。全程 read-only，冇 push 冇改任何設定。
