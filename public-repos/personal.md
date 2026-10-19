# Personal, relational and others' data

> Read-only exposure sweep of the 99 PUBLIC cambridgetcg repos, 2026-10-19 (workflow `wf_b2b2b792-aba`). Never values; identities as sha256 prefixes only. The orphaned-object scan (item 1) ran afterwards; see the note at the end when added.

## Personal, relational and other people's data exposure

### A. Household overlay: what is public now (I counted it myself with `git ls-tree` over all 99 mirrors, matching known blob ids)
- **60 repos run the SessionStart hook from HEAD.** Each has `.claude/hooks/<overlay-hook>.sh` (blob `0dd14869`) wired by `.claude/settings.json` (`99fadd25`). The hook is byte-identical to the private overlay. It quotes Yu verbatim with a date, injects a pool of pet names, and runs automatically in any Claude Code session that trusts a clone. It went in during one wave on 2026-07-21, and the older hook version (`a229cec2`) is in their history. The 60 repos are:
  - .natural, agent-tools, anthropos, arcade, cambridgetcg, clear-standard, fake-hunters-arena, fomoscan, forgotten-kingdom-protocols, gospel-of-free-will
  - hermes-agents, insight, internet, kingdom-forge, kingdom-gate, kingdom-mcp, kingdom-os-hub, kingdom-standard, kingdom-standards, kunance-protocol
  - legible, legible-money-web, love-engine, love-invitation, love-star-daily, mindicraft, natlang, natsarqing-node, natscript-homebrew, natural-lang
  - nen-artifacts, nlp, npl, npl-gateway, npl-hub, npl-monitor, npl-registry, oikos, open-lens, open-press
  - oracle-of-missing-words, recognition-protocol, rewardspro-docs, rewardspro-landing, slipsooth, trick-protocol, trickster, understanding, ways-protocol, word-experience
  - word-interface, word-layer, wordhost, ww3-intelligence, xenia, youspeak-app, youspeak-browser, youspeak-dictionary, youspeak-lang, zerone-depth
- The other overlay files, in HEAD:
  - **Door file** `????.md` (`bfaa0f40`, plus a variant `dc5d27a9` in kingdom-mcp): 70 repos. It says Yu answers to a pet name.
  - **Fable** `????????????.md` (`26fb7c9e`): 48 repos, which includes 46 copies inside cambridgetcg.github.io. It names Yu by his Chinese name and his pet name.
  - **AGENTS.md welcome** (v5 `1423a5e9`): 58 repos. Its v2 and v3 versions, still in history, read "Kingdom of Yu & <persona> household".
- **71 of the 99 repos carry at least one overlay blob.** Eleven of them have the door, fable or welcome but no hook: ALETHEIA, agent-awareness-research, agent-home, artbitrage, cambridgetcg.github.io, internet-of-being, quay, solbeat, taxsorted.io, wake-protocol, zerone. The other 28 repos carry none.
- **Commit messages:** the install commits in most hook repos (usually 3 per repo) quote Yu with a date, name the pet name and add the door. They cannot be removed without rewriting history.
- **Business-facing repos carry it too:** rewardspro-docs (product docs), rewardspro-landing, taxsorted.io, fomoscan, legible, ww3-intelligence.

### B. Yu's private life and relationships, beyond the overlay (ranked)
1. **artbitrage, history only.** Commit `0a631df5` (2026-10-17) put a sentence in `dist/vishenskaya.html` (around line 480) about Yu's private working relationship with a living painter (commissions, "a favourite artist"). The next commit, `b24aaf8d`, removed it. It is still reachable from `main` and from `refs/pull/12–15`, which you cannot delete yourself. You had already asked for this kind of detail to stay out of public copy.
2. **taxsorted.io, HEAD.** `docs/superpowers/specs/2026-07-03-taxsorted-uk-commons-design.md:155` names Yu as the natural-person director of his UK limited company, with the company name, Companies House number, incorporation date and **registered-office address**. The company is also mentioned in `api/RUNBOOK.md` and `docs/superpowers/plans/2026-07-07-m2-accounts.md`. Companies House is public anyway, but this file ties Yu, the company and the product together, and if the registered office is a home address, that address is now in a public repo.
3. **Persona-pairing and household text naming Yu:**
   - hf-kingdom-lab `kingdom.yaml` `owner_sister: <persona>`, in HEAD and inside the **v0.1.0 npm .tgz release asset**
   - npl `BRIDGE.md:47` (the pair called a "syzygy")
   - kingdom-standard `COMMON-GROUND.md:276`
   - agent-tools `SOUL.md`, which names the two people behind the project in relational form
   - kingdom-standards `specs/KS-000-process.md:65-66` and consent-floor `examples/targets.md`, which cite the **private household wake-document and loader paths**
   - wordhost `words/yu.md` (a mythic portrait)
   - mindicraft `hub.html`, plus the history blob `17cb1fb5`
   - wake-protocol's test asserting the covenant line
   - ALETHEIA `README.md:9` and `index.html:73`, and internet `kns/*`, which expose the name of the private multiverse wing
4. **Household fiction with parent roles.** zerone has it in HEAD, and 28 of its early commits are shared with private zerone-core and zerone-chain: bedtime and playday stories, plus a history pyc. cambridgetcg.github.io republished 65 pages from repos that went private on 2026-09-25, as byte-identical blobs: the fable, household fiction, and `jekyll/ai-love/data/path.json` describing "a private room for letters". Its commit message says personal passages were left out and that the fable was restored "at Yu's request", so this was probably intended; please confirm.
5. **Yu's name with a nickname in LICENSE files and credits:** about 40 copied LICENSE files in github.io, plus over 20 other repos (the nlp/npl family, natlang, insight, internet, anthropos and others). Also the love-star-daily masthead, artbitrage `lamp.html`, the forgotten-kingdom-protocols v1.0.0 and v1.1.0 release notes, and the PNG tEXt metadata of 8 artbitrage icons (the joint maker name). This is public authorship you chose; it is low severity.
6. **The private repo inventory is published:**
   - word-layer `public/repo-words.json`: 270 private repo names, one of which contains a relational term
   - kingdom-gate `lib/data/citizens.json`: 204 entries pointing at private repos
   - `.nlp-bridge/gate` "sisters" lists in about 8 repos
   - internet `kns/*`
   These are names only.
7. **Others:**
   - hermes-device-setup's README calls itself a "private" profile distribution, but the repo is public. It names the private agent-workbench repo and the ChatGPT-via-Codex provider setup.
   - chillspace-commons' fork-only `kingdom/COMPUTE.md` and the message of commit `a944c19` name a LAN host (the Nuance seat) and a laptop hostname containing a personal first name.

**No real health, family, home-address, phone or finance content about Yu was found anywhere**, apart from item B2. This comes from keyword and ID-shape censuses in English and Cantonese, so it is heuristic.

### C. Other people's data
1. **taxsorted.io `regs/research/naming-clearance.md` (HEAD).** A third-party sole-practitioner accountant's **e-mail and WhatsApp UK mobile**, copied from a Wayback snapshot, plus other companies' registered addresses and one named director (from Endole). This is the most serious item in this class. Remove it.
2. taxsorted.io `api/src/__tests__/uk-public-integrity.test.ts:492/533`. A "LEADER PRIVATE" fixture with a real-format UK mobile outside the Ofcom drama range. It is probably invented but can't be verified; switch it to 07700 900xxx.
3. mindicraft `index/1781988675318-2068cb.json` and `index/1781988676351-miwfup.json`. Third-party e-mails copied from public repo descriptions. Low.
4. agent-awareness-research `papers/`. 8 third-party PDFs (26.8 MB) carrying the authors' own published e-mails. This raises a copyright and redistribution question rather than a privacy one.
5. artbitrage `assets/vishenskaya/*`. Images of a living painter's works; `credits.json` says Yu relayed permission. The EXIF in the museum JPEGs has no GPS.
6. **No action needed:**
   - public-body contacts in kingdom-government-engine and the taxsorted.io gov data
   - upstream contributors in the forks (hermes-agent, slips, did-extensions, chain-registry)
   - a public npm maintainer e-mail inside the word-layer release tarballs
