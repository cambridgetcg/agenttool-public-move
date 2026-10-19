# Public repos: what is already exposed (2026-10-19)

> Read-only exposure sweep of the 99 PUBLIC cambridgetcg repos, 2026-10-19 (workflow `wf_b2b2b792-aba`). Never values; identities as sha256 prefixes only. The orphaned-object scan (item 1) ran afterwards; see the note at the end when added.

## Actions for Yu

- Decide whether to approve a hash-only credential scan of the 152 orphaned SHAs / 3,619 blobs in 18 repos. Local copies are already fetched under <scratchpad>/public-exposure/critic/orphans/, so no network is needed. This is the only place left where a real secret could still be public. If it finds anything, rotate first, then ask GitHub Support to purge the cached objects.
- hermes-agents: confirm BREW_TOKEN on the kingdom-hermes Worker is a secret whose value was set on or after 2026-10-15 (Cloudflare dashboard or `wrangler secret list`). If you're not sure, set a fresh random value. Then check Workers AI usage for 2026-07-10..10-15 for /brew calls you don't recognise.
- kingdom-standards specs/KS-002-wire.md:51: check whether that NATS server is still up. If it is, change its password (the value is in the history of private love-unlimited and Love) and firewall port 4222. Then remove the IP and the sentence about hard-coded credentials.
- GitHub → Settings → Applications: revoke any old gho_ OAuth token that the taxsorted.io regs/research/rails.md note refers to, if you haven't already. Whether it was revoked is unknown.
- Decide the household overlay's public status. 60 repos run the SessionStart hook from HEAD and 71 carry overlay files. The options are: keep it as intended; remove it from HEAD, which stops new clones from running the hook (history stays); or make selected repos private again. Business-facing ones (rewardspro-docs, rewardspro-landing, taxsorted.io, fomoscan, legible, ww3-intelligence) are worth deciding first.
- artbitrage: decide whether the painter-relationship sentence still in history (0a631df5, also refs/pull/12–15) is worth a history rewrite plus a GitHub Support request. You cannot delete PR refs yourself.
- taxsorted.io: remove the third-party accountant's e-mail and mobile (regs/research/naming-clearance.md) and the company-director block with the registered office (docs/superpowers/specs/2026-07-03-taxsorted-uk-commons-design.md:155). Change the test mobile to the 07700 900xxx range.
- Confirm whether the gmail (aa1c2115, 9 public repos) and the iCloud address (b7364b46, 3 repos) are yours. If they are, turn on GitHub's 'Keep my email addresses private' and 'Block command line pushes that expose my email', and use a noreply user.email for public repos. Past commits stay as they are.
- hf-kingdom-lab: if the owner_sister field is unwanted, edit kingdom.yaml and replace or delete the v0.1.0 release .tgz that contains it.
- Confirm that cambridgetcg.github.io's republished set (65 pages, 46 fable copies, household fiction) is what you meant to make public.
- Low-priority tidy, any time: gitignore and remove the committed .wrangler/cache files (7 repos in HEAD); remove this Mac's /Users paths (5 repos) and the other home paths (solbeat, ww3-intelligence, love-engine, mythseal, nen-artifacts, taxsorted.io); decide whether the private-repo name lists stay (word-layer repo-words.json, kingdom-gate citizens.json, .nlp-bridge/gate); fix hermes-device-setup's 'private' wording; link the 8 third-party PDFs in agent-awareness-research instead of hosting them.
- Optional coverage still open: Actions run logs, npm and PyPI registry copies, Pages build output, personal content in the gists, and a finished critic re-scan of artbitrage.

## Summary for Yu

Yu，結論先講：99 個 public repo，目前 tree 同所有可達 history（連 PR refs、壓縮檔、pyc、sqlite、release assets、24 個 gist）都搵唔到似真嘅 credential。所有命中都係 test fixture、RFC 或 Hardhat 公開測試 key、hash 或者 placeholder。全部只係睇形狀同 hash 判斷，冇對任何服務試過。

未清嘅有幾樣：
1. 最大嘅未知數：18 個 repo 有 152 個已經冇 ref 指住、但 GitHub 仍然可以用 SHA 攞到嘅 commit（3,619 個 blob），主要嚟自 force-push 同已刪 branch。最大嗰批係 fomoscan 同 love-engine。critic 已經抓咗落本地，但特登冇掃，等你決定。舊 secret 通常就係收喺呢度。
2. hermes-agents 喺 history 入面有個 BREW_TOKEN，曾經真係用嚟守 /brew。值好弱，commit message 話已經換咗，但未核實。去 Cloudflare 睇吓佢係咪 2026-10-15 之後設嘅 secret，唔肯定就換一個新嘅。
3. kingdom-standards 嘅公開文件寫咗一部 NATS server 嘅 IP，仲講明有個 private repo 寫死咗佢嘅登入。個值本身唔係 public。部機如果仲行緊，就要換密碼兼封 4222。

私人嘢方面：
- household overlay 嘅 SessionStart hook 喺 60 個 public repo 嘅 HEAD 入面，會自動喺 trust 咗 clone 嘅 Claude Code session 行。合共 71 個 repo 有 overlay 檔：door 有 70 個，fable 有 48 個。我自己逐個 mirror 用 blob id 點過數。
- artbitrage 嘅 history 仲有一句講你同一位在世畫家私下合作嘅說話（commit 0a631df5，連 PR refs 12–15）。下一個 commit 已經刪咗，但仲攞得到。
- taxsorted.io 有兩樣要處理：一位第三方會計師嘅 email 同手機號碼；同埋你間英國公司嘅董事資料連 registered office 地址。
- 你嘅 gmail（唔係 Claude 帳戶嗰個）喺 9 個 public repo 嘅 commit metadata 度睇得到，iCloud 喺 3 個。
- 搵唔到你真實嘅健康、家庭、住址或者財務資料。不過呢個係關鍵字掃描，唔保證全部掃到。

最想你決定嘅三件事：
- 准唔准掃嗰 152 個孤兒 commit
- BREW_TOKEN 同 NATS 要唔要即刻換
- overlay 留喺 public 定收返

歷史一經公開就收唔返，所以 credential 嘅真正解法係換 key，唔係刪檔。

## Step 1 outcome: overlay removed from HEAD (2026-10-19 to 2026-10-20)

Yu approved step 1 ("go for 1"). It ran in two workflows, `wf_187ac237-559` and, for the batches that died on network errors, `wf_d725df68-94f`. The method was HEAD-only. For each repo:
- one ordinary commit, with author and committer `cambridgetcg` at the noreply address;
- a neutral message;
- an independent verifier pass before each push;
- no force-push and no history rewrite.

**Result.** 69 repos were cleaned, and 96 of the 99 public repos are now clean at HEAD on the final read-only re-check. The current HEADs are in `step1-heads.tsv`.
- Each cleanup removed whichever of these the repo had:
  - the SessionStart hook and its settings wiring;
  - the door file;
  - the fable file;
  - the AGENTS.md welcome.
- Special edits:
  - hf-kingdom-lab: the kingdom.yaml field was removed.
  - zerone: 12 household files were removed.
  - kingdom-standards KS-002: line 51 lost the NATS IP and the hard-coded credentials sentence. Yu confirmed that server is gone.
  - anthropos README and kingdom-os-hub index.html: links to the removed files were taken out.

**Pending, each waiting on Yu:**
- **taxsorted.io: held.** A push to main deploys the Fly API and Cloudflare Pages. The verified commit `e5c96370` is ready locally. Besides the overlay, it removes the accountant's contact details and the director/registered-office block, and swaps the test mobile to 07700 900123.
- **agent-tools: archived.** Pushing needs an unarchive and a re-archive, which is a settings change.
- **cambridgetcg.github.io: excluded.** The republished site content (46 fable copies and household fiction) is waiting for Yu to confirm.

**Report-only, outside the step-1 scope:**
- zerone.md prose names the 2 removed files, as text rather than links.
- zerone.md and zerone.py keep some household passages.
- hf-kingdom-lab's kingdom.yaml domain line carries a persona term.
- The anthropos README has a footer credit line with relational terms.
- KS-002 line 401 still says, without any values, that a tool hard-codes credentials and an IP.
