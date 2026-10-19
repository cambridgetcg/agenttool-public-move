# 給 Yu 嘅摘要（synthesis 原文）

**個形狀**
- 開一個全新 public repo，建議叫 `cambridgetcg/agenttool-open`（查過，未有人用）。日常開發喺度做，經 PR，CI 免費。
- Private `cambridgetcg/agenttool` 唔改名，亦唔凍結，繼續負責 deploy、npm／PyPI release，同埋所有 secret、personal、relational 嘢。
- 每個星期，或者有需要嘅時候，由 agent 將 public main 用真 `git merge` 併返入 private main。之後 private 永遠等於「public 嘅檔案逐 byte 一樣」加「`private/` 入面嘅私人嘢」。
- Private 去 public 只有一條路，就係 export 工具：只揀 allowlist 入面嘅檔案，掃完 guard 先寫入 public。Private 嘅 commit 同歷史永遠唔會上 public。
- 四重防漏：
  - 只有一個專用 clone 識得 public，而且設咗推唔到；
  - 每部機都裝 hook，冇 denylist 就一律拒絕；
  - 會檢查 public 只有一個 root、email 必須係公開身份、canary 檔有冇被抄過去；
  - private 每日掃一次 public，連 PR 同 issue 嘅文字都掃。

**第一個 milestone**
- Public repo 一開始只放 packages，即係 agenttool-packages 而家已經公開緊嗰批，加上之後嘅大約 53 個改動。
- 呢一步唔使你做任何內容 ruling；deploy、release、secrets 全部唔郁。
- 完成標準：
  - public 有 PR merge 咗；
  - 兩次 merge-back 乾淨；
  - 照舊路出到一次 npm release；
  - scan 0 hit。
- api、apps、docs 等你之後一次過做完 ruling 先搬。

**要你而家決定（3 樣，每樣有建議）**
1. Repo 名：建議 `cambridgetcg/agenttool-open`。
2. 講一聲「go」，一次過批 stage 0–1：
   - 範圍只係 packages；
   - deploy 同 release 唔郁；
   - merge-back 由 agent 定期跑，check 唔過就停低報告；
   - 喺各部機裝 git hooks、每日 scan（launchd），同埋 Claude／Codex 嘅 push 攔截 hook（可以唔要）。
3. Wallet：建議先用而家條 lane 出修好嘅版本先公開；另一個選擇係 stage 1 暫時唔包 wallet。
- 另外有一下：P0 推上去之後仍然係 private 狀態，我會俾你睇檢查收據，你話「flip」先轉 public。呢步係收唔返嘅。

**要你親手做**
- 喺 npmjs.com revoke NPM_TOKEN。
- 確認 private 歷史入面嗰 9 條舊 credential 已經失效，特別係 prod 嗰條 `at_p_` key。唔肯定就 rotate。
- 喺 GitHub 帳戶開「Keep my email addresses private」同「Block command line pushes that expose my email」。我冇權限驗證呢兩個設定。

**之後先問**
- Stage 3：內容 ruling，一次過問，每項都有預設。包括 persona enums、心心符號、credits、引用你講過嘅說話、已經 live 嘅頁、`/public/law`、licences。另外問埋已經 live 嘅私人 surface 要唔要落；預設係唔郁。
- Stage 4（可選）：npm 同 PyPI 嘅 trust 轉去新 repo，archive agenttool-packages。預設唔做，繼續用 agenttool-packages 做 release mirror。
