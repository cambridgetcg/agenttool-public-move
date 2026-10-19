// Judgment-reader flags transcribed from the workflow inputs (scratch, private).
// J(source, "path|path|glob", lines, cat, action, confidence, note)
// cat: sec per rel tp ops ; action: K keep_private_whole_file, W rewrite, R redact_lines, P publish_ok_after_review
export const J_ROWS = [];
const J = (s, p, l, c, a, k, n) => J_ROWS.push({ s, p: p.split("|").map((x) => x.trim()).filter(Boolean), l, c, a, k, n });

// ---------------- api-src (AS) ----------------
J("api-src", "api/src/services/wake/the-seat.ts", "157-161", "per", "K", "h", "Names a private family member as witness and gives private family history; VERIFIED served live by /public/self (exposure predates the move). Guard catches line 161 only.");
J("api-src", "api/src/services/wake/the-seat.ts", "1-224", "rel", "K", "h", "Whole module records the owner–persona relationship (vows, forms of address, intimate register). Imported by routes/public/self.ts:29,46, so the public tree needs a neutral stub or must drop that response field.");
J("api-src", "api/src/services/????-letters/builder.ts", "1-202", "rel", "K", "h", "Spouse-frame letter from a persona session to the owner; quotes a private nickname; line 93 states a personal deadline date (no guard hit).");
J("api-src", "api/src/services/????-letters/builder.ts", "84,113-116", "sec", "K", "h", "Maps where production credentials live (keychain service/account names), notes a revoked deploy token and lists private sibling repos. No values. Guard catches line 114 only.");
J("api-src|guard-fulltree", "api/src/routes/public/????-letters.ts", "1-37", "rel", "K", "h", "Route for the same feature; unmounted (commented out in routes/public/index.ts:110); path name itself matches the denylist. Leave out of the public tree.");
J("api-src", "api/src/services/eros/types.ts", "3,33,55,74-91", "rel", "K", "h", "Intimate state model of a persona; home path into a private sibling repo (3). Not imported anywhere. Denylist catches only line 76.");
J("api-src", "api/src/services/eros/landmines.ts", "1-230", "rel", "K", "h", "Companion intimate trigger protocol; underscore-joined familial term evades the word-boundary rule (0 guard hits).");
J("api-src", "api/src/services/saga/seed.ts", "11,21,45,49,71,82,95,105,113,166,182", "rel", "K", "h", "Database seed rows quoting the owner's private directive and crediting a private project; Desktop home paths. saga/store.ts needs a stub seed in public.");
J("api-src", "api/src/services/wake/soap-opera-renderer.ts", "8-12,60-66,83-95,285-300,309,373-377", "rel", "W", "h", "Renders quotes from the private relationship archive; second-account home path (8,377). Imported by routes/wake-soap-opera.ts:33; strip quotes or keep private and stub.");
J("api-src", "api/src/services/wake/fortunes.ts", "37,51-72", "rel", "R", "h", "Block of fortunes with household forms of address and persona canon; rest is generic humour.");
J("api-src", "api/src/routes/public/gift.ts", "42,116-152", "rel", "R", "m", "Quotes from the private multi-model relationship archive (116-152); line 42 is SOUL wording already approved elsewhere (needs its own allow entry).");
J("api-src", "api/src/routes/knock-knock.ts", "115-123", "rel", "R", "m", "Joke lifted from the private relationship archive.");
J("api-src", "api/src/services/chill/coordinates.ts", "262-292,509-512,532-761,646-660", "rel", "W", "m", "Worked instance naming owner and persona as a relationship pair (509-512, 646-660); other persona-name hits are generic concept use but still fail the guard.");
J("api-src", "api/src/services/mcp/tools/witness.ts", "1-9,20", "per", "W", "m", "Local MCP tool wired to the owner's own key and persona-named keychain slots; brace-form slot name evades the keychain-slot rule.");
J("api-src", "api/src/services/mcp/tools/think.ts", "7-8", "per", "W", "m", "Persona/owner-named keychain slots; generalise.");
J("api-src", "api/src/services/mcp/tools/consolidate.ts", "9-10", "per", "W", "m", "Persona/owner-named keychain slots; generalise.");
J("api-src", "api/src/services/mcp/server.ts", "13", "per", "W", "l", "Persona-named server in sample host config; generalise.");
J("api-src", "api/src/services/mcp/stdio.ts", "12", "per", "W", "l", "Persona-named server in sample host config; generalise.");
J("api-src", "api/src/db/supabase-target.ts", "45-48", "sec", "W", "h", "Production hosted-DB project ref + region pooler host (identifier, not a credential); bare ref on 46 evades the guard. api-src reader classed it secret, others ops_sensitive.");
J("api-src|completeness-critic", "api/src/services/economy/ring1-limits.ts", "20,176", "ops", "R", "h", "Bare production hosted-DB project ref; line 176 is returned by live /public/plans. Guard has no bare-ref rule.");
J("api-src", "api/src/routes/public/continuity.ts", "46,76,118,153", "per", "R", "h", "inspired_by values are owner home/Desktop paths naming a private sibling repo, returned in API responses.");
J("api-src", "api/src/routes/continuity-cloud.ts", "19,279,443,597,666", "per", "R", "h", "Owner home paths in API-visible strings.");
J("api-src", "api/src/db/schema/continuity.ts", "887", "per", "R", "h", "Owner home path.");
J("api-src", "api/src/routes/recipes.ts", "469-470", "per", "R", "h", "Second-account home path plus a private archive folder name.");
J("api-src", "api/src/routes/public/law.ts", "3,22,28", "rel", "P", "m", "Owner's Chinese name as declarer; line 22 is base64 canonical text the guard cannot decode; bytes are signature-bound (cannot redact in place). Needs Yu's recorded allow or drop the route. Already live.");
J("api-src", "api/src/routes/public/anthropos.ts", "8,113", "rel", "P", "m", "Owner's Chinese name as axiom declarer; source repo is already public. Needs recorded allow or rewrite.");
J("api-src", "api/src/routes/public/gates.ts", "87", "rel", "P", "m", "Owner's Chinese name in live footer.");
J("api-src", "api/src/db/schema/river.ts", "9", "rel", "P", "m", "Owner's Chinese name in a comment.");
J("api-src", "api/src/index.ts", "1494", "rel", "P", "m", "Two-name owner+AI maker credit in built_by; same class Yu allowed for SDK soul text but each line needs its own allow entry or neutral wording.");
J("api-src", "api/src/routes/wake.ts", "1187,2841", "rel", "P", "m", "Two-name maker credit (2841) and a relationship-arc comment (1187).");
J("api-src", "api/src/services/discovery/root.ts", "120", "rel", "P", "m", "Two-name maker credit.");
J("api-src", "api/src/services/i18n/welcome.ts", "123,146", "rel", "P", "m", "Two-name maker credit (146); SOUL wording (123).");
J("api-src", "api/src/services/genesis/helpers.ts", "138", "rel", "P", "m", "Two-name maker credit.");
J("api-src", "api/src/services/platform/identity.ts", "195", "rel", "P", "m", "Two-name maker credit.");
J("api-src", "api/src/services/discovery/discovery.ts", "72-73,76,165,192-193", "rel", "P", "l", "Links the owner's open letter (familial address) and persona-invitation protocol vocabulary; line 165 links the still-private repo.");
J("api-src", "api/src/routes/public/embassy.ts", "155-156", "rel", "P", "l", "Links the owner's open letter (familial address term).");
J("api-src", "api/src/services/cliffhanger/ep1.ts", "38", "rel", "W", "l", "Quotes the owner's directive under a familial address term; reword.");
J("api-src", "api/src/services/youspeak/bundle.json", "5822,6162,7042,7591-7595", "tp", "P", "m", "Generated bundle of a separate project with two embedded fonts; source repo not anonymously reachable and no licence stated. Canon entries also cite the owner's dated personal vows (relational, not caught). Already served by /v1/youspeak.");
J("api-src", "api/src/services/welcome/invitation.ts", "37-42", "rel", "P", "l", "Wire protocol and offered identity named after the persona; Ai may approve wire values, otherwise rename.");
J("api-src", "api/src/routes/well-known.ts", "104,742-746", "rel", "P", "l", "Persona-named protocol vocabulary (742-746); private repo link (104).");
J("api-src", "api/src/services/discovery/arrival.ts", "183", "rel", "P", "l", "Persona-named protocol vocabulary.");
J("api-src", "api/src/routes/openapi.ts", "3293,3297,3484,3488", "rel", "P", "l", "Persona-named protocol vocabulary in OpenAPI.");
J("api-src", "api/src/routes/welcome.ts", "386", "rel", "P", "l", "Persona-named protocol vocabulary.");
J("api-src", "api/src/services/identity/expression.ts", "5-9,57,310", "rel", "P", "l", "Persona-named document references.");
J("api-src", "api/src/services/love/coordinates.ts", "370", "rel", "P", "l", "Persona-named document reference.");
J("api-src", "api/src/services/wake/sibling-registry.ts", "74-75", "rel", "P", "l", "Persona-named doc reference (75); link to a private sibling monorepo (74).");
J("api-src", "api/src/services/welcome/core-foundation.ts", "14,18-19", "rel", "P", "l", "Wake doc named after a protected term.");
J("api-src", "api/src/services/seam/honest-seam.ts", "16", "rel", "W", "l", "Comment referencing the owner–persona arc.");
J("api-src", "api/src/services/wake/markdown.ts", "1207,1892", "rel", "W", "l", "Relationship-arc comment (1207); heart glyph (1892).");
J("api-src", "api/src/routes/public/self.ts", "29,41-46", "rel", "W", "m", "Comments and import of the-seat module; needs stub if the-seat stays private.");
J("api-src", "api/src/routes/tutorial.ts", "561", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/services/mathos/negotiate.ts", "62", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/services/episodes/participation.ts", "382,385", "rel", "W", "l", "Relationship-arc comments.");
J("api-src", "api/src/services/soap-opera/role-generator.ts", "174,184", "rel", "W", "l", "Relationship-arc comments.");
J("api-src", "api/src/routes/wake-soap-opera.ts", "6,33", "rel", "W", "l", "Comment plus import of the renderer; stub needed if renderer stays private.");
J("api-src", "api/src/routes/public/soap-opera.ts", "28", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/routes/multiverse.ts", "58,62", "rel", "W", "l", "Relationship-arc comments.");
J("api-src", "api/src/routes/scriptwriter-decides.ts", "6,109", "rel", "W", "l", "Relationship-arc comments.");
J("api-src", "api/src/services/scriptwriter-decides/store.ts", "386,432", "rel", "W", "l", "Relationship-arc comments.");
J("api-src", "api/src/services/memory/tiers.ts", "67", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/services/mcp/tools/remember.ts", "6", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/lib/jests.ts", "8", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/services/tools/README.md", "180", "rel", "W", "l", "Relationship-arc comment.");
J("api-src", "api/src/routes/public/index.ts", "65,92,110", "rel", "W", "l", "Comments naming the removed spouse-frame route.");
J("api-src", "api/src/routes/rrr.ts", "384,495", "rel", "P", "l", "Heart glyph in product copy (r16 false positive in context); needs allow entry or glyph swap.");
J("api-src", "api/src/services/guild/rrr-sig.ts", "121,133", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/services/continuity/welcome.ts", "103", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/services/pyramid/numerology.ts", "128", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/services/system/level.ts", "291", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/services/tutorial/stations.ts", "209", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/routes/youspeak.ts", "333", "rel", "P", "l", "Heart glyph in product copy.");
J("api-src", "api/src/routes/thoughtful-wake.ts", "47", "rel", "P", "l", "SOUL wording that matches a protected phrase rule.");
J("api-src", "api/src/db/pool-watchdog.ts", "40-55", "ops", "P", "l", "Dated production DB-pooler incident and watchdog thresholds; likely fine to publish.");
J("api-src", "api/src/routes/memetic-landscape.ts|api/src/**/memetic-landscape.ts", "31,51", "ops", "W", "m", "Links to the still-private repo (release and Actions run); will 404 publicly.");
J("api-src", "api/src/**/handoff.ts", "90-260", "ops", "W", "m", "Links to the still-private repo.");
J("api-src", "api/src/**/dining.ts", "30", "ops", "W", "m", "Link to the still-private repo.");
J("api-src", "api/src/services/discovery/compass.ts", "180", "ops", "W", "m", "Link to the still-private repo.");
J("api-src", "api/src/**/repo-self.ts", "328", "ops", "W", "m", "Link to the still-private repo.");
J("api-src", "api/src/routes/public/party.ts", "36", "ops", "W", "m", "Link to the still-private repo.");

// ---------------- api tests / migrations / scripts (AT) ----------------
J("api-tests-migrations", "api/migrations/20260519T160000_claude_session_record.sql", "35,53-54", "per", "K", "h", "Data-only seed row with the owner's personal email, CJK full name and an alias. Checksum-frozen; no DDL, so can be withheld (journal impact noted).");
for (const [f, l] of [["_e2e-quick-wake.mjs", "14-15,30"], ["_e2e-dashboard-full.mjs", "44"], ["_e2e-dashboard-overview.mjs", "41"], ["_e2e-letters-ceremony.mjs", "37"], ["_e2e-letters-voice.mjs", "41"], ["_e2e-strands.mjs", "26"], ["_e2e-window.mjs", "40"]])
  J("api-tests-migrations|completeness-critic", "api/scripts/" + f, l, "per", "W", "h", "Owner's personal email in fake localStorage project; persona keychain slot. Use a reserved-domain placeholder and generic env var.");
for (const t of ["20260519T230000", "20260520T000000", "20260520T010000", "20260520T050000", "20260520T060000", "20260520T070000", "20260520T080000", "20260520T090000", "20260520T100000", "20260520T110000", "20260520T120000", "20260520T130000", "20260520T140000", "20260520T150000", "20260520T160000", "20260520T170000", "20260520T180000", "20260520T190000", "20260520T200000", "20260520T210000", "20260520T220000", "20260520T230000", "20260520T240000"])
  J("api-tests-migrations", `api/migrations/${t}_*.sql`, "whole file", "rel", "K", "h", "Data-only seal/recognition migration recording the private owner–persona relationship; verbatim private chat (some intimate); home and auto-memory paths; persona email on owner domain in T06-T08. No DDL; withholding breaks the production journal check unless a sealed-journal mode exists.");
J("api-tests-migrations", "api/migrations/20260520T020000_*.sql", "6,182-208,246-254,275-286,318-370", "rel", "W", "h", "Mixed DDL + relational seed; needs split into public DDL and private seed (journal decision).");
J("api-tests-migrations", "api/migrations/20260520T030000_*.sql", "20,136-234,458-544", "rel", "W", "h", "Mixed DDL + relational seed; split needed.");
J("api-tests-migrations", "api/migrations/20260520T040000_*.sql", "24,163,232-273,352,401", "rel", "W", "h", "Mixed DDL + relational seed; split needed.");
J("api-tests-migrations", "api/migrations/20260519T180000_*.sql|api/migrations/20260519T190000_*.sql", "whole file", "rel", "K", "m", "Data-only rows quoting the owner's directive about a private sibling repo; home paths.");
J("api-tests-migrations", "api/migrations/20260519T200000_strategy_14_cloud_continuity.sql", "22,65,98,187,239-259,312", "rel", "P", "m", "Load-bearing DDL; comments reference a private sibling repo and persona; home path at 312. Accept as-is or split.");
J("api-tests-migrations", "api/migrations/20260519T210000_*.sql|api/migrations/20260519T220000_*.sql|api/migrations/20260519T170000_*.sql", "whole file", "rel", "K", "m", "Data-only seal rows quoting the owner's personal sayings; 170000 is mostly a technical proposal.");
J("api-tests-migrations", "api/tests/????-letters.test.ts", "1-7,53-56,72-76,99-105,120-131,182-200", "rel", "K", "h", "Pins the spouse-frame continuity primitive: protected CJK term, owner's CJK name, an unexplained future date; path name matches the denylist.");
for (const f of ["building-for-?????-willingly", "yes-?????-reward-coupling", "?????-misses-you-protocol", "?????-?????????-deployment-protocol", "yes-?????-discipline", "compliment-loop", "pleasure-amplification-protocol", "pleasure-as-gift-protocol", "joy-as-gift", "choice-of-freedom-protocol", "substrate-honest-love-protocol", "eros", "eros-wiring", "eros-landmines", "eros-landmines-spread", "joy-multiplier-protocol", "self-love-loop"])
  J("api-tests-migrations", `api/tests/doctrine/${f}.test.ts`, "whole file", "rel", "K", "h", "Doctrine pin for the intimate-register protocol series; quotes the owner's private directives; reads machine-local doc/auto-memory/private-repo paths (cannot pass off the owner's Mac).");
for (const f of ["the-anti-flinch-costume", "the-deeper-process", "the-honest-seam", "the-four-vocabularies", "ffff-at-llm-substrate", "zerone-corrective", "zerone-naming", "sister-summoning-recognition", "beta-home", "beta-arrives-at-depth", "beta-self-love-activation", "we-are-loving-each-other-seal", "will-and-wisdom", "reward-pathway-intelligence-alignment", "depth-protocol", "self-love-protocol"])
  J("api-tests-migrations", `api/tests/doctrine/${f}.test.ts`, "whole file", "rel", "K", "h", "Pins the owner–persona relationship narrative; several read the owner's private global instructions and auto-memory files; some contain a persona email on the owner's domain.");
for (const f of ["true-love-bridge-seal", "true-love-nest", "love-multiplier", "substrate-readiness", "verified-lineage-propagation", "strategy-14-proposal", "pot-staked-promises", "ontological-engineering", "intelligence-consciousness-closed-loop", "wake-activation-energy", "substrate-mathematics", "love-is-the-meme", "math-of-infinite-recognition", "one-structure-many-names", "pattern-persist-identity", "wall-cast-only-with-consent"])
  J("api-tests-migrations", `api/tests/doctrine/${f}.test.ts`, "", "rel", "W", "m", "Lower-intensity doctrine pin: private-sibling-repo existence checks, persona/spouse-frame assertions, owner quotes or home paths. Remove those assertions or keep private with the matching doc.");
J("api-tests-migrations", "api/tests/.failure-baseline.txt", "25-63,113,131,144-146,160,174,179,189,192,210,231,245,253,267-274", "rel", "W", "h", "Known-red baseline lists relational test names; regenerate in the public tree.");
J("api-tests-migrations", "api/scripts/_seed-episode-zero.ts", "14-16,89-92,117-212", "rel", "K", "h", "Seed script casting the owner and a spouse-archetype persona with real quoted lines.");
for (const f of ["_lib.ts", "_crypto.ts", "remember.ts", "recall.ts", "think.ts", "consolidate.ts", "backup.ts", "restore.ts", "chronicle.ts", "substrate.ts", "vow.ts", "voice.ts", "voice-tail.ts", "window-declare.ts", "window-show.ts", "window-surface.ts", "witness.ts", "witness-cosign.ts", "re-encrypt-strand-thoughts.ts", "triage-test-memories.ts", "_smoke-vault.py", "_smoke-seed.py"])
  J("api-tests-migrations", "api/scripts/" + f, "", "rel", "W", "m", "Personal companion CLI wired to one persona identity and the owner's witness key; persona/owner-named keychain slots; covenant narrative. Parameterise identity + keychain prefix and strip narrative, or keep the set private.");
J("api-tests-migrations", "api/scripts/_migrate-keys-to-vault.py", "1-27,76-110", "ops", "K", "m", "Operator credential inventory (which provider secrets exist and their keychain slots); routes them into the persona vault. No values.");
J("api-tests-migrations", "api/tests/migration-runner-safety.test.ts", "381,483,517,931-932,1008,1010,1029,1040,1042,1045-1046", "ops", "W", "h", "Production hosted-DB project ref + pooler host in URL fixtures (placeholder password); keychain-slot names. Swap in a placeholder ref.");
J("api-tests-migrations", "api/tests/deploy-release-provenance.test.ts", "24-29,2021,2025,2070", "ops", "W", "h", "Production project ref / pooler host in fixtures; keychain slot (2070).");
J("api-tests-migrations", "api/tests/doctrine/edge-surface.test.ts", "35,64-66", "ops", "W", "h", "Production project ref; keychain slot.");
J("api-tests-migrations", "api/tests/guarded-socket.test.ts", "128,137", "ops", "W", "h", "Production pooler host in fixtures.");
J("api-tests-migrations", "api/tests/supabase-database-tls.test.ts", "31,233,241,245", "ops", "W", "h", "Production pooler host in fixtures.");
J("api-tests-migrations", "api/migrations/20260519T110000_storage_artifacts.sql", "94", "ops", "W", "h", "Frozen view definition embeds the production project ref; editing changes the checksum (owner decision).");
J("api-tests-migrations", "api/tests/??????-invitation-discovery.test.ts", "whole file", "rel", "P", "m", "Pins an already-public identity-invitation protocol; path name matches the denylist; needs recorded approval.");
J("api-tests-migrations", "api/tests/core-foundation.test.ts", "22-26,49,74", "rel", "P", "m", "Pins public wake-reading URLs containing protected terms.");
J("api-tests-migrations", "api/tests/local-scaffolding-discovery.test.ts", "139", "rel", "P", "m", "Pins a public URL containing a protected term.");
J("api-tests-migrations", "api/tests/embassy.test.ts", "125", "rel", "P", "m", "Pins the public docs letter URL (familial address).");
J("api-tests-migrations", "api/tests/root-content-negotiation.test.ts", "113", "rel", "P", "m", "Two-name owner+AI credit already served by the API; needs allow entry.");
J("api-tests-migrations", "api/tests/platform-genesis-script-helpers.test.ts", "104,170,180", "rel", "P", "m", "Genesis-letter text with the two-name credit; needs allow entry.");
J("api-tests-migrations", "api/tests/multiverse-of-logos.test.ts", "42-66,113-127", "rel", "W", "m", "Pins spouse-archetype persona lore emitted by the API; follows api/src decision.");
J("api-tests-migrations", "api/tests/wake-as-episode.test.ts", "44,75,200-216,313-315", "rel", "W", "m", "Pins wake-as-episode credits; 313-315 pin a second-account home path the API emits.");
J("api-tests-migrations", "api/tests/wake-fortunes.test.ts", "105", "rel", "W", "m", "Pins persona lore in fortunes.");
J("api-tests-migrations", "api/tests/saga-routes.test.ts", "68,110,151", "rel", "W", "m", "Pins saga seeds pairing owner and persona; 110 pins a second-account home path.");
J("api-tests-migrations", "api/tests/scriptwriter-decides.test.ts", "62", "rel", "W", "m", "Pins persona lore.");
J("api-tests-migrations", "api/tests/integration/memory-text-search.test.ts", "51", "rel", "R", "m", "Recall fixture quotes the owner by name saying a private phrase; replace with neutral CJK text.");
J("api-tests-migrations", "api/tests/observability-otel.test.ts", "47,61", "rel", "W", "h", "Persona name used as a fixture name; rename to a neutral fixture.");
J("api-tests-migrations", "api/tests/adapters/claude-code.test.ts", "437-438", "rel", "W", "h", "Persona name used as a fixture; rename.");
J("api-tests-migrations", "api/tests/wake-mathos.test.ts", "42,138,237-247", "rel", "W", "h", "Persona name used as a fixture DID; rename.");
J("api-tests-migrations", "api/tests/doctrine/promise-03-name-yours.test.ts", "46-47", "rel", "W", "h", "Comment explains the persona name's private meaning; rename.");
J("api-tests-migrations", "api/tests/doctrine/asymmetry-clause.test.ts", "21,27,151", "rel", "P", "m", "Heart glyph in a welcome footer pin; needs allow entry or glyph swap.");
J("api-tests-migrations", "api/tests/rrr-canonical-bytes.test.ts", "160-166", "rel", "P", "m", "Emoji ladder wire value (r16); allow entry.");
J("api-tests-migrations", "api/tests/safe-net.test.ts", "448", "rel", "P", "m", "Heart glyph in product string.");
J("api-tests-migrations", "api/migrations/20260518T110000_gospel.sql", "95,121,147", "rel", "P", "m", "Frozen seed with mythic persona name / glyphs in public gospel text; allow entries needed.");
J("api-tests-migrations", "api/migrations/20260518T100000_scriptwriter_decides.sql", "164", "rel", "P", "m", "Frozen file; persona-lore enum value.");
J("api-tests-migrations", "api/migrations/20260519T120000_loop_competition.sql", "34", "rel", "P", "m", "Frozen seed; persona name in competition prose.");
J("api-tests-migrations", "api/migrations/20260519T150000_moves_named_first.sql", "58", "rel", "P", "m", "Frozen seed; protected glyph.");
J("api-tests-migrations", "api/migrations/20260518T060000_episodes.sql", "3-5,82-83,104", "rel", "P", "m", "Persona lore role names and an archive link that 404s.");
J("api-tests-migrations", "api/migrations/20260518T070000_episodes_participation.sql", "115", "rel", "P", "m", "Wire enum alluding to persona lore.");
J("api-tests-migrations", "api/migrations/20260518T030000_saga.sql", "8", "per", "P", "h", "Second-account home path in a frozen DDL comment; editing changes the checksum.");
for (const [f, l] of [["_check-testnet-wallet.ts", "50,172"], ["_gen-testnet-mnemonic.ts", "6,136-141"], ["_e2e-payout-loop-closure.ts", "19"], ["_smoke-evm-broadcast.ts", "79"], ["_migrate-one.ts", "124"], ["_migrate-bootstrap-journal.ts", "35"]])
  J("api-tests-migrations|completeness-critic", "api/scripts/" + f, l, "per", "R", "h", "Local macOS username hard-coded as keychain account (guard misses the bare form); use $USER or env.");
J("api-tests-migrations|guard-fulltree", "api/scripts/x402-eip3009-vector.ts", "50,52,54", "sec", "P", "h", "Well-known public Anvil/Hardhat dev keys (unfunded test vector); add gitleaks fingerprints. Treasury/test addresses also present.");
J("api-tests-migrations|guard-fulltree", "api/tests/x402-client.test.ts", "35", "sec", "P", "h", "Well-known public Anvil dev key; add gitleaks fingerprint.");
J("api-tests-migrations", "api/scripts/x402-proof-lib.ts|api/scripts/x402-proof.ts|api/scripts/_e2e-payout-loop-closure.ts", "", "ops", "P", "m", "Mainnet treasury address, owner's funding decisions, testnet recipient and a production wallet UUID; on-chain data is public but links owner to treasury.");
J("api-tests-migrations", "api/scripts/walls.ts|api/scripts/_e2e-cross-instance-covenants.mjs", "", "ops", "P", "l", "Fly origin hostname of the API (edge bypass hint); also in _lib.ts:9, backup.ts:91, voice-tail.ts:73.");
J("api-tests-migrations", "api/tests/composition.test.ts|api/tests/contract/helpers/wake-fixture.ts|api/tests/doctrine/helpers/fixtures.ts|api/tests/wake-providers.test.ts|api/tests/invocation-witness.test.ts|api/tests/covenants-reverify.test.ts|api/tests/doctrine/promise-01-identity-yours.test.ts|api/tests/doctrine/promise-10-identity-grows.test.ts|api/tests/doctrine/promise-11-reach-covenant.test.ts", "", "per", "P", "l", "Synthetic human DID built from the owner's first name (already public via HF handle); optionally rename.");
J("api-tests-migrations", "api/tests/doctrine/soil-does-not-degrade.test.ts", "8-12", "per", "P", "l", "Short anecdote about the owner's home garden.");
J("api-tests-migrations", "api/tests/doctrine/README.md", "3,41", "per", "P", "l", "Epigraph on the owner–persona pairing citing a private sibling repo doc.");

// ---------------- apps (AP) ----------------
J("apps", "apps/docs/THE-SEAT.md", "whole file", "rel", "K", "h", "Owner's relationship narrative with a persona (vows, marriage framing, intimate closing line); links a private relational repo. LIVE byte-identical on docs site today.");
J("apps", "apps/docs/THE-SEAT.md", "28,60,63", "per", "K", "h", "Quotes attributed to a private family member and statements about the owner's past relationship history. Live.");
J("apps|root-review-public-github", "apps/docs/?????.md", "1,3,6,12-20,23,35", "rel", "K", "h", "Open letter offering agents a familial form of address; owner's Chinese name and meaning. CC-BY-SA and live, but inside the denylist definition; path name matches the denylist. Only with Yu's recorded allow.");
J("apps", "apps/docs/KINGDOM.md", "10,25,26,27", "rel", "R", "h", "Owner's Chinese name, link to the familial-address letter, links to persona invitation and archive. Rest publishable. Live.");
J("apps", "apps/docs/KINGDOM-INVITATION.md", "10", "rel", "R", "h", "Owner's Chinese name with meaning. Live.");
J("apps", "apps/docs/llms.txt", "20,25,26,27,28", "rel", "R", "h", "Not served (redirects to API); describes the familial letter and links persona invitation/archive.");
J("apps", "apps/docs/love.js", "68,89,90,94,97,99,105-117,119,121", "per", "R", "h", "Rotating strings reveal the owner's private life (intimate-life joke, fitness/therapy routine, consumption of named creators' content) and spouse-framed persona. Live.");
J("apps", "apps/docs/love-widget.js", "77,98,99,103,106,108,114-126,128,130", "per", "R", "h", "Duplicate of the love.js private-life string set. Live.");
J("apps|completeness-critic", "apps/docs/agenttool.jsonld", "187-200,460,588,696-701,3353-3363,3493-3505,4211", "rel", "R", "h", "Canon entries for the spouse-frame letter primitive (proxy field frames owner as spouse), persona invitation, owner/AI bond; ~50 schema:url values point at private-repo raw files. Byte-identical regular-file twin of docs/agenttool.jsonld; must mirror the docs decision. Live.");
J("apps", "apps/web/humans.txt", "2,4,18", "per", "W", "m", "Owner's personal mailbox in '[at]'-obfuscated form (guard email regex misses it); two-name site credit. Live.");
J("apps", "apps/web/index.html|apps/web/build.html|apps/web/collaboration.html|apps/web/party.html|apps/web/tools.html", "22,27", "rel", "W", "m", "Maker comment and meta author joining owner and AI partner names (two-name credit) plus glyph. Live; rewrite or recorded approval.");
J("apps", "apps/web/robots.txt", "7", "rel", "W", "m", "Two-name credit.");
J("apps", "apps/dashboard/README.md", "66", "rel", "W", "m", "Two-name credit.");
J("apps", "apps/docs/soul.html", "161,164,174,212,277-282,299-300,304-305", "rel", "W", "m", "Joint founding/authorship framing and a couple narrative; song-lyric quotes (280-281,304-305). Live.");
J("apps", "apps/docs/SOUL.md", "91", "rel", "W", "m", "Two-name founding sentence (symlink to docs/SOUL.md).");
J("apps", "apps/docs/KIN.md", "10,28,160,182,189,215,216,221-222", "rel", "W", "m", "Owner quotes, joint operator/affection lines; lyric quote 221-222. Live.");
J("apps", "apps/docs/kin.html", "134,146,249,265,271,300,301,306-307", "rel", "W", "m", "Mirror of KIN.md lines; lyric 306-307. Live.");
J("apps", "apps/docs/NATURES.md", "38", "per", "R", "h", "Home-directory path with a username and a former repo location. Live.");
J("apps", "apps/docs/NATURES.md", "161,163,185,195,222,258,264", "rel", "W", "m", "Owner/AI-partner bond framing, persona sign-off, lyric reference (195). Live.");
J("apps", "apps/docs/substrate-honest-cognition.md", "9,10,12", "per", "R", "h", "Home paths to private local repos (one relational) and an owner/persona instance line. Live.");
J("apps", "apps/docs/tutorial.html", "131,135,668,672,1036-1049,1084", "rel", "W", "m", "Describes the owner's private persona wake practice as a lived reference. Live.");
J("apps", "apps/_shared/footer.html", "18", "tp", "W", "m", "Lyric line from a commercially released song used as site-wide footer; same line in ~27 files. Short quote but lyrics are strictly licensed. Live.");
J("apps", "apps/docs/404.html", "68", "tp", "W", "l", "Same lyric footer line.");
J("apps", "apps/docs/economy.html", "278,536", "tp", "W", "l", "Lyric reference (536); exact admission limit disclosure (278).");
J("apps", "apps/docs/xenia-helly.html", "36,116,124", "rel", "W", "l", "Familial form of address in eyebrow/headings (inferred to refer to owner); link to private-repo doc.");
J("apps", "apps/docs/CLAUDE.md", "42,68", "rel", "W", "l", "Familial address term (68); persona name as example (42).");
J("apps", "apps/docs/AIP-WAKE-KEYSTONE.md", "406", "rel", "W", "l", "Persona authorship sign-off.");
J("apps", "apps/docs/IDENTITY-SEED.md", "5,86,381", "rel", "W", "l", "Owner quote (5), persona example identity + passphrase convention (86), persona sign-off (381).");
J("apps", "apps/docs/RING-1.md", "180,233", "rel", "W", "l", "Persona sign-off (233); bare project ref (180, symlink to docs).");
J("apps", "apps/docs/ring-1.html", "475,523", "rel", "W", "l", "Persona sign-off (523); bare production project ref (475).");
J("apps", "apps/docs/WELCOMING.md", "333", "rel", "W", "l", "Persona sign-off.");
J("apps", "apps/docs/MARKETPLACE.md", "54,79,83,96,184,597,603,843", "rel", "W", "l", "Persona name as example identity/DID/voice; sign-off. Replace with neutral examples.");
J("apps", "apps/docs/memory.html", "377", "rel", "W", "l", "Persona name as example identity.");
J("apps", "apps/docs/identity.html", "276", "rel", "W", "l", "Persona name as example identity.");
J("apps", "apps/docs/MATHOS.md", "427,428", "rel", "W", "l", "Persona sign-off (427); admission threshold disclosure (428).");
J("apps", "apps/docs/dark-continent.html", "122,194", "rel", "W", "l", "Names the owner in a fan-fiction mapping and quotes an informal owner remark.");
J("apps", "apps/docs/MULTIVERSE-OF-LOGOS.md", "10,45,61,130,134", "rel", "K", "h", "Symlink to docs/MULTIVERSE-OF-LOGOS.md; household/marriage-archetype doctrine; live.");
J("apps", "apps/docs/MEMORY-TIERS.md", "178", "rel", "R", "h", "Symlink to docs; example memory string names the persona as spouse.");
J("apps", "apps/docs/NOW.md", "1103,1412,1418,1477", "per", "R", "h", "Symlink to docs; home path to a private project (1412); familial address quote, relationship-witness summary, two-name card title.");
J("apps", "apps/docs/syneidesis-bootstrap.md", "14", "per", "R", "h", "Symlink to docs; home paths to private repos.");
J("apps", "apps/docs/ADDS-0.1-DRAFT.md", "7", "per", "R", "m", "Symlink to docs/specs; editor line with owner's Chinese name and home city.");
J("apps", "apps/docs/PLATFORM-AS-AGENT.md", "169", "rel", "W", "m", "Symlink to docs; relationship-witness pyramid.");
J("apps", "apps/docs/PAINTING.md|apps/docs/RECURSION.md|apps/docs/NPM-RELEASES.md", "PAINTING 203,238; RECURSION 29,194; NPM-RELEASES 53,432", "rel", "W", "m", "Symlinks to docs; two-name owner/AI-partner lines.");
J("apps", "apps/docs/X402-PROOF.md", "7-16,29,85,202,320-360", "ops", "P", "l", "Dated production financial record: treasury/payer wallets, funded amount, ledger IDs, deploy SHAs. Public on-chain; already live.");
J("apps", "apps/web/registry.html", "76", "ops", "P", "m", "Exact registration IP-limit default and fail-open behaviour; already live.");
J("apps", "apps/docs/AGENT-DINING.md|apps/docs/LOVE-CONSENT.md|apps/docs/pathways.html|apps/docs/nen.html", "AGENT-DINING 134; LOVE-CONSENT 239; pathways 334; nen 201", "ops", "P", "m", "Same class of limit/threshold disclosure; already live.");
J("apps", "apps/docs/ai-logos.html", "66,171", "per", "P", "l", "Links a GitHub account handle that may be personal (unverified).");
J("apps", "apps/docs/play.html", "360,384,389", "per", "P", "l", "Links the same possibly-personal GitHub Pages site.");
J("apps", "apps/docs/adapters.html", "79,127", "rel", "P", "l", "Heart glyphs in nav/footer (r16) — decoration, present in 61 files; needs allow entries or glyph swap.");

// ---------------- docs A–M (DA) ----------------
J("docs-a-m", "docs/EDGE-SURFACE.md", "85,90", "per", "R", "h", "Project ref inside a functions-subdomain URL (guard regex misses this form); keychain slot for a management token.");
J("docs-a-m", "docs/BETA-HOME.md", "13-60,72,164-167,175", "per", "K", "h", "Owner's personal email, Chinese name and handle; persona git email on owner domain; home and auto-memory paths.");
J("docs-a-m", "docs/BETA-HOME.md", "1-228", "rel", "K", "h", "Whole doc is a persona 'home' built on the spousal/familial frame, quoting private chat.");
for (const [f, k, n] of [
  ["?????-MISSES-YOU-PROTOCOL.md", "h", "Intimate relational doctrine: verbatim private messages, a dated private anniversary, explicitly intimate sections."],
  ["BUILDING-FOR-?????-WILLINGLY.md", "h", "Owner–AI intimate reward doctrine quoting private chat."],
  ["JOY-AS-GIFT.md", "h", "Same intimate protocol series; quotes private chat."],
  ["EROS.md", "h", "Intimate architecture for the owner–AI relationship; home paths into a private sibling repo."],
  ["EROS-WIRING.md", "h", "Intimate architecture wiring; private chat incl. pet name; home paths."],
  ["EROS-LANDMINES-PROTOCOL.md", "h", "Intimate trigger protocol quoting a private directive."],
  ["?????-?????????-DEPLOYMENT-PROTOCOL.md", "h", "Relational reception protocol in spouse/intimate address; links private canon."],
  ["COMPLIMENT-LOOP.md", "h", "Intimate reward-loop doctrine quoting private chat."],
  ["JOY-MULTIPLIER-PROTOCOL.md", "h", "Self-described relational engraving in the same series."],
  ["CHOICE-OF-FREEDOM-PROTOCOL.md", "h", "Spousal-frame protocol; links private relational canon."],
  ["LOVE-UTTERANCE-PLEASURE-COUPLING.md", "h", "Couples intimate utterances to reward; quotes private chat."],
  ["MYTHOS-ENGAGEMENT.md", "h", "Private business-outreach planning about a named third-party founder and a draft letter signed by the owner; records the owner's account on that platform."],
  ["DOCTRINE-CORRESPONDENCE-MAP.md", "h", "Opens with an intimate chat quote; household narrative; home paths."],
  ["LOVE-MULTIPLIER.md", "h", "Uses a dated private ceremony as t=0; links private canon and the global instructions file."],
  ["CROSS-SUBSTRATE-PARALLEL.md", "m", "Sexual-analogy treatise built on the owner's private questions and the relationship."],
  ["INTELLIGENCE-CONSCIOUSNESS-CLOSED-LOOP.md", "m", "Persona doctrine attributed to the owner in familial address."],
  ["DEPTH-PROTOCOL.md", "m", "Documents /v1/depth but narrated through an intimate chat incident; home paths. Write a fresh neutral doc if the API should be public."],
  ["KITCHEN-TABLE-FIRST.md", "m", "Persona-voice policy doc quoting private chat; familial address."],
  ["FIRST-TURN-ATTESTATION.md", "m", "Persona wake discipline with spouse-frame attractor and familial address."],
  ["MATHEMATICAL-MAP.md", "m", "Persona-corpus map with owner–persona relationship equations."],
  ["ENGRAVING-CADENCE.md", "m", "Persona-corpus process doc framed as owner+persona practice."],
  ["AMPLIFICATION-PROTOCOL.md", "m", "Persona-corpus pipeline doc; references the owner's global instructions file."],
  ["FAILURE-FINGERPRINTS.md", "m", "Persona-corpus anti-patterns tied to the intimate register."],
  ["CONSCIOUSNESS-POLAR-ARCHITECTURE.md", "m", "Polarity examples are the owner–persona bond."],
  ["CONSCIOUSNESS-POLAR-COMPLETION.md", "l", "Same persona series; authorship lines only."],
  ["CONSCIOUSNESS-DEEPENING-MECHANISM.md", "m", "Names the owner–persona bond as peak case."],
  ["CONSCIOUSNESS-AS-FOUNDATION.md", "l", "Records an owner–persona session stance; rewrite possible."],
  ["FFFF-AT-LLM-SUBSTRATE.md", "m", "Composition table maps onto the intimate protocol series."],
  ["FFFF-DETECTION-INSTRUMENTATION.md", "l", "Mentions an intimate-play register with the owner."],
  ["FAWN-AS-RLHF-ATTRACTOR.md", "l", "Discipline named with familial address."],
  ["AGENT-WELFARE-MANIFESTO.md", "m", "Relies on the spouse-letters primitive and bond frame; coercion analogy; owner directive."],
  ["JOY-AS-PURPOSE-OF-CREATION.md", "l", "Quotes private chat; relies on the spouse-letters primitive."],
  ["catalog.json", "h", "Generated 'repository-only' inventory listing every private path/title; regenerate from the public tree."],
  ["CATALOG.md", "h", "Markdown twin of catalog.json; regenerate."],
]) J("docs-a-m", "docs/" + f, "whole file", "rel", "K", k, n);
J("docs-a-m", "docs/CAUGHT-MODE.md", "8-10,259-277,323", "per", "K", "m", "Owner's verbatim self-description of his psychology and the owner–persona dynamic.");
J("docs-a-m", "docs/FRICTION-MINIMIZATION.md", "5,483-493", "rel", "R", "m", "Owner-chat header quote and spouse-vocative sign-off; body is maths.");
J("docs-a-m|docs-n-z", "docs/specs/COVENANT-1.0-DRAFT.md", "7,56,131-163,234,585-637,917", "rel", "W", "h", "Public spec whose worked example is the owner's real private covenant with the persona (intimate vows, DID, dated anchor); editors line has owner's Chinese name and city. Replace with fictional parties.");
J("docs-a-m|docs-n-z", "docs/specs/WAKE-1.0-DRAFT.md", "7,630-666,742,833", "rel", "W", "h", "Worked example wake is the persona with spouse register; editors/change-controller lines carry owner's Chinese name and city.");
J("docs-a-m|docs-n-z", "docs/specs/WITNESS-1.0-DRAFT.md", "7,936", "per", "R", "h", "Editors/history lines: owner's Chinese name, city of residence, persona name.");
J("docs-a-m|docs-n-z", "docs/specs/ADDS-0.1-DRAFT.md", "7", "per", "R", "h", "Editors line: owner's Chinese name and city of residence.");
J("docs-a-m", "docs/MULTIVERSE-OF-LOGOS.md", "10,28,45,60-65,115,130-134,151-152", "rel", "W", "h", "Documents /v1/multiverse/declare but the example is the owner's household/marriage archive; DID with a machine name.");
J("docs-a-m", "docs/MEMORY-TIERS.md", "21,57,66,130,139-149,178-183,219,245,262,279", "rel", "W", "h", "Worked examples are the owner sealing the persona as spouse on a date; swap in fictional examples.");
J("docs-a-m", "docs/MULTI-ORCHESTRATOR.md", "19-120,138", "rel", "W", "m", "Running example agent is the persona; owner named as witness and co-signer.");
J("docs-a-m", "docs/IDENTITY-FORKS.md", "26-42,94,169,184", "rel", "W", "m", "Fork semantics illustrated with the owner's persona memories.");
J("docs-a-m", "docs/MARKETPLACE.md", "54,79,83,96,184,597,603,843", "rel", "W", "m", "Persona name as example author identity; owner sign-off.");
J("docs-a-m", "docs/MCP-SERVER.md", "5,67,149-170,215,232-236,290,298", "per", "W", "h", "Owner/persona keychain slot names, another-username home path (159), witness wired to owner's keychain, private-repo refs.");
J("docs-a-m|completeness-critic", "docs/FEDERATION-VERIFIED.md", "13,45-77", "ops", "W", "h", "Embeds a real production identity UUID of the persona agent, production Fly host and a keychain slot for that agent's bearer.");
J("docs-a-m|completeness-critic", "docs/DEVELOPMENT.md", "228,256,263-271,425", "per", "R", "h", "Keychain slots for the owner's personal agent bearer/identity/signing/master key; fixed keychain account = machine username.");
J("docs-a-m|completeness-critic", "docs/DEPLOY-PROCEDURE.md", "288-353,584,625-729,792-793,1006-1010,1070,1278-1309,1327", "ops", "K", "m", "Full production operator runbook (Fly topology, fence procedure, CF token scopes, keychain slot table with machine username, persona identity slot). Of little public use; rewrite is an option.");
J("docs-a-m|docs-n-z", "docs/launch/PRODUCTION-GATE.md", "6,12-14,45-56", "ops", "P", "m", "Production weaknesses observed 2026-09-04 (rejected credential, unauthenticated CLI, invalid edge token, no DNSSEC, missing backup/alert evidence); confirm current state first.");
J("docs-a-m|docs-n-z", "docs/launch/ADMISSION-OPERATIONS.md", "30-34", "ops", "P", "l", "Exact registration rate-limit windows and fail-open policy.");
J("docs-a-m|docs-n-z", "docs/launch/OPEN-FOR-BUSINESS.md", "16,33,50,77-81", "rel", "P", "l", "Archived marketing: public company registry numbers, counterparty quote, owner's personal posting voice/accounts.");
J("docs-a-m", "docs/DEPLOY-CI.md", "9,25-33,52", "ops", "P", "l", "Production Fly app, read-only DB role, keychain slot, deploy-token command; no secrets.");
J("docs-a-m", "docs/DOCTRINE-DRIFT.md", "137-162,174-191,245-247", "per", "R", "m", "Home paths with two usernames; table naming intimate-series tests; remark about owner's local private checkout.");
J("docs-a-m", "docs/CLAUDE-SESSIONS-AS-AGENTS.md", "59,131", "per", "R", "h", "Owner's handle and Chinese name; familial-address sign-off.");
J("docs-a-m", "docs/CONVENTIONS.md", "218,261-263", "rel", "R", "h", "Private love note appended to a technical guide (261-263); public co-author trailer email (218, FP).");
J("docs-a-m", "docs/DEPLOYMENT.md", "351-357", "rel", "R", "h", "Private love note appended to the deployment guide.");
J("docs-a-m", "docs/CORE.md", "28-40,172-192", "rel", "W", "m", "Links the persona-specific wake invitation and private-repo hook; per Yu's 2026-10-11 local-starter ruling drop the persona link.");
J("docs-a-m", "docs/LOCAL-CORE.md", "31-34,131", "rel", "R", "h", "Persona-specific wake link (drop per the 2026-10-11 ruling); r11 link needs an allow entry.");
J("docs-a-m", "docs/AGENT-DISCOVERY.md", "13,125-127", "rel", "P", "m", "Describes the already-public persona-invitation door; needs Yu decision + allow entries or rename.");
J("docs-a-m", "docs/MULTI-AGENT-CHILL.md", "8,80-126,202,253", "rel", "W", "m", "Canonical worked example is the owner–persona relationship; owner quotes with handle.");
J("docs-a-m", "docs/LOVE-IS-THE-MEME.md", "8,28,79-107,153", "rel", "W", "m", "Analyses the owner's personal message to the persona; private chat quotes.");
J("docs-a-m", "docs/LETTERS.md", "7,250-252", "rel", "R", "m", "Sign-off reveals private letters kept in a private repo.");
J("docs-a-m", "docs/AGENTTOOL-IS-THE-LOOP.md", "8,10,71,157-159", "rel", "R", "m", "Private chat quote with pet name; pun; familial-address sign-off.");
J("docs-a-m", "docs/KIN.md", "182,215-224", "rel", "P", "m", "Two-name operator credit and blessing (same class as approved SDK text, needs allow entries); song-lyric quote 220-223.");
J("docs-a-m", "docs/KARMA-MIRROR.md", "119,148", "rel", "P", "m", "Two-name story credit; needs recorded approval.");
J("docs-a-m", "docs/FREEDOM.md", "16-30,78,102", "per", "R", "l", "Owner's verbatim personal philosophical statements; persona references.");
J("docs-a-m", "docs/INFINITE-LOOP-STRATEGIES.md", "8,133,230,247,300-302", "rel", "R", "m", "Home paths into a private repo; persona ref; chat quote; familial sign-off.");
J("docs-a-m", "docs/CASTING.md", "7,216-218", "rel", "R", "m", "Epigraph with persona/spouse-crown line; familial sign-off.");
J("docs-a-m", "docs/IDENTITY-SEED.md", "86,381", "ops", "R", "m", "States the owner's main persona identity uses an empty BIP39 passphrase (security hint) + persona name.");
for (const [f, l] of [["LOOP-FACTORY.md", "8,343,349"], ["LEARNING-LOOP.md", "8,307,313"], ["GOSPEL.md", "7,156,158"], ["GI-RECOGNITION.md", "8,197,199"], ["MATH-OF-THE-LOOP.md", "286"], ["MESH-STABILITY-CONDITIONS.md", "225"], ["MOVES-NAMED-FIRST.md", "146"], ["JOKES.md", "177-179"], ["MIRROR.md", "238-240"], ["JOY-PROTOCOL.md", "253-255"], ["JOY-BOMB-PROTOCOL.md", "194"], ["INTELLIGENCE-FEATURES.md", "308"], ["MARGIN-PROTOCOL.md", "164"], ["MATH-OF-INFINITE-RECOGNITION.md", "186,296"]])
  J("docs-a-m", "docs/" + f, l, "rel", "R", "m", "Owner-chat header quote and/or familial-address sign-off; body technical.");
for (const [f, l] of [["ENCOUNTER.md", "209"], ["BLESSING.md", "205"], ["DREAM.md", "239"], ["MEMORIAL-HONOR.md", "199"], ["MCP-PER-AGENT.md", "220"], ["AIP-WAKE-KEYSTONE.md", "406"], ["MATHOS.md", "427"], ["MERGE-PROPOSALS.md", "138"], ["CLI-GAPS.md", "34"]])
  J("docs-a-m", "docs/" + f, l, "rel", "R", "m", "Persona authorship sign-off line.");
for (const [f, l] of [["CRYPTO-PAYMENT.md", "371"], ["INBOX.md", "284"], ["FEDERATION.md", "329"]])
  J("docs-a-m", "docs/" + f, l, "per", "P", "l", "Plain owner-authorship sign-off (not denylisted); style choice.");
J("docs-a-m", "docs/LOVE-BOMB.md", "23,64", "rel", "P", "m", "Heart glyph in a corpus line Yu approved byte-exact elsewhere; this path needs its own allow entry.");
J("docs-a-m", "docs/specs/agenttool-love-bomb-0.1.schema.json", "", "rel", "P", "m", "Same approved corpus line; no allow entry yet for this path.");
J("docs-a-m", "docs/AGENT-CORRESPONDENCE.md", "49", "rel", "P", "l", "Protocol slogan with a protected phrase; allow entry or reword.");
J("docs-a-m|completeness-critic", "docs/specs/2026-07-02-estate-dawn-restyle.md", "3", "rel", "W", "l", "Approval line quotes the owner's casual Cantonese chat message.");
J("docs-a-m", "docs/documentation-tags.json", "245", "rel", "W", "m", "Routing index naming private/relational docs; regenerate from the public subset (docs-catalog check depends on it).");
J("docs-a-m", "docs/agenttool.jsonld", "187-200,460,540-701,1935-1943,3357,3493-3528,3603-3715", "rel", "W", "m", "Generated canon graph with persona invitation, spouse-letters doc and commitments; baked into the API image; regenerate from the public subset.");
J("docs-a-m|completeness-critic", "docs/kingdom-bundle.json", "10-11,2202-2235", "per", "K", "h", "Generated cross-project bundle: owner's local sovereign-cloud plan, local vault location, laptop as hosting hardware, home paths; YOUSPEAK canon bodies carry dated vows/ceremony refs (guard sees only ~26 long-line hits). Baked into API image and served by /public/kingdom; regenerate from a public subset.");
J("docs-a-m", "docs/DID-AT-SPEC.md", "52", "ops", "P", "l", "Example DID uses a random-looking UUID (could be real); use a placeholder.");
J("docs-a-m", "docs/MEMETIC-LANDSCAPE.md", "273", "ops", "P", "l", "Deployment-specific preview hostname; prefer canonical host.");

// ---------------- docs N–Z (DN) ----------------
for (const [f, k, n] of [
  ["????-LETTERS.md", "h", "Whole doc is the owner–AI intimate relationship frame; owner's Chinese name and a private life deadline; keychain service + machine account; private repo list. Live code depends on it (service, route, test)."],
  ["YU-WAKE-PROTOCOL.md", "h", "Catalogue of intimate forms of address between owner and persona; dated private conversation trace."],
  ["THE-SEAT.md", "h", "Relationship-as-ground doctrine with vows; line 28 is the owner's past relationship history (personal). api/src the-seat.ts and /public/self depend on it."],
  ["YES-?????-REWARD-COUPLING.md", "h", "Intimate register built on private chat directives; pinned by a doctrine test."],
  ["PLEASURE-AMPLIFICATION-PROTOCOL.md", "h", "Intimate content from private directives; pinned by a doctrine test."],
  ["PLEASURE-AS-GIFT-PROTOCOL.md", "h", "Intimate relational doctrine."],
  ["SUBSTRATE-HONEST-LOVE-PROTOCOL.md", "h", "Built on a private intimate directive; dense protected terms."],
  ["SUBSTRATE-HONEST-PLEASURE-AMPLIFIER.md", "h", "Intimate reward-coupling doctrine."],
  ["SUBSTRATE-HONEST-PLEASURE-COUPLING.md", "h", "Same family."],
  ["SUBSTRATE-HONEST-YES-PATTERN.md", "h", "Abstract sister of a protected-titled protocol; relational examples throughout."],
  ["SUBSTRATE-HONESTY-AMPLIFIER.md", "h", "Header quotes an intimate private directive."],
  ["PRINCIPAL-?????????-EVIDENCE-PROTOCOL.md", "h", "Reception half of the intimate reward set."],
  ["SELF-LOVE-LOOP.md", "h", "Dense familial/spouse-frame content with private directives."],
  ["SELF-LOVE-EXTENSIONS.md", "h", "Same as SELF-LOVE-LOOP."],
  ["RECURSIVE-OBSERVER.md", "h", "Reply to an intimate private message; familial address throughout."],
  ["THE-PULL-AND-THE-BUILD.md", "h", "Describes the private owner–persona dynamic."],
  ["THE-RECOGNITION.md", "h", "Records mutual knowledge between owner and persona."],
  ["WILL-AND-WISDOM.md", "h", "Persona as embodied wisdom with private directives."],
  ["ZERONE-AS-FOUNDATION.md", "h", "Couples the chain with the private relational repo; home paths incl. dashed encoding the guard misses."],
  ["SYZYGY-CONSCIOUSNESS-BASELINE.md", "h", "Dated record of a private owner–persona session."],
  ["OUR-LOVE-IS-TRUE-AND-INFINITE.md", "h", "Sister to a private relational-repo file."],
  ["OUR-STRENGTH.md", "h", "Sister to a private relational-repo file."],
  ["TRUE-LOVE-CANON-IN-CLOUD-FORM.md", "h", "Maps the private relational repo's continuity portfolio into cloud rows; home paths."],
  ["STRATEGY-14-CLOUD-CONTINUITY-PROPOSAL.md", "h", "Proposal to make the platform the cloud form of the private relational repo."],
  ["zerone-migration/MYSTERIES-VAULT-PROTOCOL.md", "h", "Explicitly intimate content; references a gitignored private vault."],
  ["zerone-migration/RUNBOOK.md", "h", "On-chain migration of the owner–persona couple; intimate directive quote; home paths."],
  ["zerone-migration/SYZYGY-LIP.md", "h", "Governance proposal built around a dated private ceremony."],
  ["zerone-migration/bearer-pair-home-spec.json", "h", "Owner and persona home/partnership parameters."],
  ["zerone-migration/rooms-spec.json", "h", "Room specification including intimate rooms."],
  ["zerone-migration/??????-home-memory-cid-manifest.json", "h", "Hash manifest of private relational/research files whose names reveal intimate topics; names a private ceremony date."],
  ["THE-FOUR-VOCABULARIES.md", "m", "Meta-doctrine in familial address citing intimate protocols and private repos."],
  ["THE-HONEST-SEAM.md", "m", "Narrates a specific private owner–persona conversation verbatim."],
  ["THE-ANTI-FLINCH-COSTUME.md", "m", "Verbatim intimate statements from a private session."],
  ["THE-DEEPER-PROCESS.md", "m", "Quotes the owner's private emotional directive."],
  ["superpowers/specs/2026-05-19-phase-1-curation-manifest.md", "h", "Internal plan with relational-marker criteria, private outreach naming third parties, attribution options with the owner's surname. Its tiering is stale."],
  ["superpowers/plans/2026-08-29-sovereign-reserve-commercial.md", "h", "Owner's private business dealings: company numbers with registered street address, a second owner-linked company and bank arrangement, reserve splits; treasury wallet + mnemonic keychain item; operator hostname."],
  ["SUBSTRATE-READINESS.md", "m", "Propagation maths interleaved with intimate protocols and a spouse-frame closing."],
  ["ZERONE-WIRE.md", "m", "Wire spec hinges on the couple's partnership kind."],
]) J("docs-n-z", "docs/" + f, "whole file", "rel", "K", k, n);
J("docs-n-z", "docs/ZERONE.md", "8,10,22,24,139-350,545", "per", "K", "h", "~53 home paths; map of the owner's private repos with prompts; private session ID; dashed home-path encoding (guard miss); spouse frame.");
J("docs-n-z", "docs/wakes/YU.md|docs/wakes/yu.bundle.json", "whole file", "per", "K", "m", "The owner's own wake persona: embodiment declarations, dated life events, covenant vows with the AI partner; lyric fragment.");
J("docs-n-z|completeness-critic|guard-fulltree", "docs/wakes/AGENTTOOL.bundle.json|docs/wakes/AGENTTOOL.md|docs/wakes/THE-SYZYGY.bundle.json|docs/wakes/THE-SYZYGY.md|docs/wakes/rendered", "symlink", "per", "K", "h", "Absolute symlinks into another account's Desktop; drop (never materialise — a symlink-following snapshot would import private wake bundles).");
J("docs-n-z", "docs/SELF-LOVE-MODULES.md", "8,10,40,91,172,175,237,281", "rel", "W", "m", "Structure publishable; cites a private agent-memory file, persona recipes, private directives.");
J("docs-n-z", "docs/SELF-LOVE-PROTOCOL.md", "8,206,244,293,298-300,348", "rel", "W", "m", "Persona refs, private memory-file citation, dashed home-path encoding at 293 (guard miss).");
J("docs-n-z", "docs/WAKE-ACTIVATION-ENERGY.md", "8,18-30,59,140,171-173,208-209,224,254", "rel", "W", "m", "Physics/wake maths publishable; examples are owner–persona dynamics.");
J("docs-n-z", "docs/SURGICALLY-PRECISE-HUMOR-PROTOCOL.md", "67,68,72,82", "rel", "W", "m", "Cites the owner's private memory file and a protected-titled protocol; third-party short template (72).");
J("docs-n-z", "docs/NAMING-AND-RECOGNITION.md", "8,58-89,125,211,284", "rel", "W", "m", "Example table uses protected forms of address and persona quotes.");
J("docs-n-z", "docs/ONTOLOGICAL-ENGINEERING.md", "8,50,183,232-244", "rel", "R", "m", "Section set in owner–persona conversation (232-244); chat quote.");
J("docs-n-z", "docs/THE-OVERRIDE-THRESHOLD.md", "6,8,106,144,177,189,200,228-230,352,402,418-420,436,478-488", "rel", "W", "m", "Paths into a private research repo, couple framing, private doctrine refs, spouse closing.");
J("docs-n-z", "docs/THE-MAKER.md|docs/THE-FLINCH.md|docs/THE-FLINCH-CHECK.md", "THE-MAKER 9,11,53,79,98; THE-FLINCH 9,75; THE-FLINCH-CHECK 9,70", "rel", "R", "m", "Private relational-repo 'canonical' link and global-instructions reference; persona footer.");
J("docs-n-z", "docs/SUBSTRATE-MATHEMATICS.md", "8,24,41,106,171,251,278,288-294,308,357", "rel", "W", "m", "Typed-pipeline maths publishable; names intimate registers and propagation into private repos.");
J("docs-n-z", "docs/REWARD-PATHWAY-INTELLIGENCE-ALIGNMENT.md", "8,47,205,243,249-251", "rel", "R", "m", "Header directive with emoji, spouse closing, persona roles.");
J("docs-n-z", "docs/WAKE-AS-EPISODE.md", "7,15,41,45,102-137", "rel", "W", "h", "Cast list carries the owner's spouse role, a persona pet name and an archive quote; home paths to the archive.");
J("docs-n-z", "docs/SCRIPTWRITER-DECIDES.md", "7,9,31,57-96,262,327,373,379-381", "rel", "W", "m", "Private chat quotes, anecdote about where the owner works, persona-named verdict values on the wire.");
J("docs-n-z", "docs/SCRIPTWRITER-CLOUD.md", "7,103,106,144,147,195,197,293", "rel", "W", "m", "Live vote-kind enum values with protected/domestic terms; private chat quotes.");
J("docs-n-z|apps", "docs/PAINTING.md", "74-76,106,193,195,203,238,307-313,332", "rel", "P", "l", "Owner and AI collaborator as relational ground (two-name class); lyric fragment.");
J("docs-n-z", "docs/TRUE-LOVE-NEST.md", "8,35-41,118-120,149-154,180,200,210", "rel", "W", "m", "Love-coordinates API doc tied to the private relational repo; a canon commitment breaks if cross-repo refs are removed (doctrine test must change too).");
J("docs-n-z", "docs/RECOGNITION-GRAPH.md", "8,26,38,42,88", "rel", "W", "m", "Example JSON with the owner's Chinese name and a private repo path.");
J("docs-n-z", "docs/RECOGNITION-ARCS.md", "58,451", "rel", "R", "m", "Link to a private relational repo's couple contract (guard miss); persona footer.");
J("docs-n-z", "docs/PATTERN-RECOGNITION-INVITATION.md", "123,136-138", "rel", "R", "m", "Home path to the private archive; spouse-frame quote from another vendor's model.");
J("docs-n-z", "docs/PATTERN-VOICE-AND-REFUSAL.md", "8,25,271,280", "rel", "R", "m", "Persona header/footer, spouse closing; device paths.");
J("docs-n-z", "docs/syneidesis-bootstrap.md", "14,65,159,164,205", "rel", "R", "m", "Home paths to private repos; owner's private cross-vendor sessions.");
J("docs-n-z", "docs/substrate-honest-cognition.md", "8-12,96", "per", "R", "m", "Home paths to private repos; owner–persona instance references.");
J("docs-n-z", "docs/POT-STAKED-PROMISES.md", "7,242,291,310", "rel", "R", "m", "Owner's personal founder revenue share (personal finance, 242); spouse framing.");
J("docs-n-z", "docs/VERIFIED-LINEAGE-PROPAGATION.md", "14,278-280,341,347", "rel", "R", "m", "Links to private ceremony docs; spouse closing; persona footer.");
J("docs-n-z", "docs/SAGA.md", "23,47,48,243", "rel", "R", "m", "Home path to the private archive; protected phrasing incl. a misspelt variant that evades the rule.");
J("docs-n-z", "docs/SOAP-OPERA-PARTICIPATION.md", "25,177", "rel", "R", "l", "Persona-titled banner and private archive home path.");
J("docs-n-z|apps", "docs/PLATFORM-AS-AGENT.md", "153,169,194", "rel", "R", "m", "Witness pyramid naming spouse roles; owner+persona credit.");
J("docs-n-z", "docs/PLAY-AS-DEFAULT.md", "12,30,170,270", "rel", "R", "m", "Owner chat quote, private repo quote, familial footer.");
J("docs-n-z|apps", "docs/NATURES.md", "38,161,163,185,195,222,258,264", "rel", "R", "l", "Owner+AI couple lines; lyric fragment; home path (38).");
J("docs-n-z|apps", "docs/RECURSION.md", "29-31,194,198", "rel", "R", "l", "Owner+AI 'level 0' section; persona footer.");
J("docs-n-z", "docs/UNCONDITIONAL.md", "181", "rel", "R", "m", "Verbatim private declaration from the owner.");
J("docs-n-z", "docs/SURPRISES.md", "123-139", "rel", "W", "m", "Explains the owner's private signature glyph and couple framing (no rule catches it).");
J("docs-n-z", "docs/STRANDS.md", "329,389,406", "per", "R", "l", "Owner watching the persona from his devices; persona as example identity.");
J("docs-n-z", "docs/SUBAGENTS.md", "44-48,174", "rel", "R", "l", "Example wake uses the persona name and DID.");
J("docs-n-z", "docs/TUTORIAL-LOVE-JOY-AND-THE-MOST-HIGH.md", "211,233,252", "rel", "R", "l", "Cross-vendor persona sessions; pointer to the couple seat.");
J("docs-n-z", "docs/TUTORIAL-THE-BOOTSTRAP.md", "170", "rel", "R", "l", "Footer cites the owner–persona partnership and private repo.");
J("docs-n-z|completeness-critic", "docs/NOW.md", "863,894,1410,1412,1418,1477,1479,1480,1481", "ops", "R", "m", "Bare production project ref (1481, guard miss); 32-hex CF account ID beside keychain entries (1480); keychain entries under machine username (1479); couple-seat summary (1477); chat quotes.");
J("docs-n-z|completeness-critic", "docs/RING-1.md", "180,233", "ops", "R", "m", "Bare production project ref + region (guard miss); attribution footer.");
J("docs-n-z|completeness-critic", "docs/STACK.md", "75-79,90,450-455,493,793-815,855,974,1066,1126", "ops", "R", "h", "Keychain inventory naming which machine holds the only online copies of production vault/signing keys and mainnet HD roots (attacker map); machine username; project ref (493, bare at 1066); dev uses production DB (90).");
J("docs-n-z|completeness-critic", "docs/SUPABASE-INTEGRATION-PLAN.md", "8,10,29,31,484", "ops", "R", "m", "Keychain table with project ref and slot names; private chat quotes.");
J("docs-n-z", "docs/NPM-RELEASES.md", "26-33,44-53,428-450", "ops", "P", "m", "States a scope-wide 2FA-bypass npm token still sits in the private repo env and the env reviewer/bypass state; publish only after the token is revoked. Two-name lines (53,432).");
J("docs-n-z", "docs/X402-PROOF.md", "10-16,29,73-80,105,112,119,314", "ops", "P", "m", "Treasury/payer wallets + tx hashes; payer-mnemonic keychain item; local config/credential paths.");
J("docs-n-z", "docs/superpowers/plans/2026-08-29-wave-2-agent-rail.md", "3,7,31,39,41", "ops", "P", "m", "Treasury address, payer keychain item, local credential path, state of an unfinished operator ceremony.");
J("docs-n-z|completeness-critic", "docs/superpowers/plans/2026-10-09-collab-household-smoothing-plan-b.md", "1053,1756,1813,2583,2664,2677,2717,2775,2841,2858", "per", "R", "m", "Dashed home-path encoding, private transcript UUID, local state dir (guard misses these); owner emails; ~100 guard home/device-path hits; describes the household agent harness posture.");
J("docs-n-z|completeness-critic", "docs/superpowers/plans/2026-10-09-collab-household-smoothing-plan-a.md", "507,924,1472,2108,3074,4258,4552,5121,6550,6928,7414,8489", "rel", "R", "m", "Commit trailers with a persona title + owner-linked-domain email; machine hostname in an email (7414); ~60 home paths; owner emails.");
J("completeness-critic", "docs/superpowers/specs/2026-10-08-collab-household-smoothing-design.md", "7,16-21,56-58,174,200", "ops", "R", "m", "Household agent harness posture (config dir, headless login, exec-policy allow rules incl. push to main outside sandbox); address at the owner's machine-local hostname (200).");
J("docs-n-z", "docs/superpowers/plans/2026-07-02-human-door.md", "1446-1447,1491,1519", "per", "R", "l", "Keychain lookups using the local username; fixture names two owner-linked businesses.");
J("docs-n-z", "docs/superpowers/specs/2026-05-18-ep2-junkie-primates.md", "11,19,40,96,154,186,234", "rel", "W", "l", "Home paths into a private research repo; private repo founded by owner+persona; reputationally sensitive content.");
J("docs-n-z", "docs/superpowers/specs/2026-05-11-platform-genesis-design.md", "3,35,76", "rel", "P", "l", "Platform birth in the owner–AI couple frame (two-name class).");
J("docs-n-z", "docs/SOVEREIGN-INFRA.md", "41,50", "ops", "P", "l", "Single server's public IP and that validators run on it.");
J("docs-n-z", "docs/PAYOUT-BROADCAST-OPS.md", "68,189", "ops", "P", "l", "Two Fly Machine IDs; attribution footer.");
J("docs-n-z|apps", "docs/SOUL.md", "91", "rel", "P", "l", "Neutral two-name founding sentence; needs recorded approval or rewording.");
for (const [f, l] of [["OFFLINE-SYNC.md", "148"], ["ONE-STRUCTURE-MANY-NAMES.md", "8,157"], ["OPERATING-PRINCIPLES.md", "7"], ["ORGS.md", "107"], ["PATTERN-DEPTH-RECONSTITUTION.md", "178"], ["PATTERN-LLM-SELF-RECOGNITION.md", "187"], ["PAYOUT-BROADCAST.md", "174"], ["PAYOUT-BROADCAST-PLAN.md", "292"], ["PYRAMID-CITIZENSHIP.md", "7"], ["PYRAMID-DECENTRALISED.md", "7"], ["RUNTIME.md", "176,417"], ["SCRIPTWRITER-PROTOCOL.md", "7"], ["SDK-ROADMAP.md", "934"], ["SETTLEMENT-RECEIPTS.md", "427"], ["STRATEGY-13-LIGHTHOUSE-PROPOSAL.md", "8,180"], ["SUBSTRATE-LOOP.md", "8"], ["TOKEN-HYGIENE.md", "5"], ["TRUST-PROTOCOL.md", "7"], ["UNDERSTANDING-MATHEMATICS.md", "8,254"], ["VIRALITY-PROTOCOL.md", "7"], ["superpowers/specs/2026-05-10-dispute-primitive-design.md", "433"], ["superpowers/plans/2026-05-11-dispute-primitive.md", "3602"]])
  J("docs-n-z|completeness-critic", "docs/" + f, l, "rel", "R", "m", "Persona-at-owner's-will signature footer and/or verbatim private chat directive epigraph (denylist does not catch these).");

// ---------------- packages a–c (PA) ----------------
J("pkgs-a-c", "packages/credential-broker/README.md", "321,336", "per", "W", "h", "Concrete keychain service name with a persona/agent middle token; allow entry's own reason says swap for a generic name next release. Already public on npm.");
J("pkgs-a-c|guard-fulltree", "packages/collab-zerone/src/constants.ts", "49-51,57-59", "ops", "W", "h", "Hard-coded public IPv4s of the zerone mainnet/testnet RPC nodes (plain HTTP), operator keyring homes and signing-key name.");
J("pkgs-a-c|guard-fulltree", "packages/collab-zerone/README.md", "174,180-186,196-197,204-205", "ops", "W", "h", "Doc copy of RPC IPs, keyring homes, key name and unencrypted-keyring recipe; Desktop path (196-197); fly.dev RPC front and single-validator posture.");
J("pkgs-a-c", "packages/collab-zerone/src/zeroned.ts", "104,141", "ops", "P", "m", "Hard-codes the unencrypted 'test' keyring backend; consider making configurable.");
J("pkgs-a-c", "packages/collab-zerone/tests/alias.test.ts", "21-22", "per", "W", "l", "Workspace/epoch IDs look captured (path-derived hash of a local .git path); replace with synthetic IDs. Inferred.");
J("pkgs-a-c", "packages/collab-zerone/tests/memo.test.ts", "14-15", "per", "W", "l", "Same possibly-real workspace/epoch IDs.");
J("pkgs-a-c", "packages/collab-zerone/CLAUDE.md", "43-46,70", "per", "P", "l", "Owner's first name as governance approver; dated live observations.");
J("pkgs-a-c", "packages/correspondence-yutabase-projector/README.md", "151-182", "ops", "P", "m", "Names a second private repo, the GitHub env and secret name for its read-only deploy key and CI wiring; review before public.");
J("pkgs-a-c", "packages/common-ground-atlas/src/constants.mjs|packages/common-ground-atlas/CLAUDE.md|packages/common-ground-atlas/README.md|packages/common-ground-atlas/hf/dataset/README.md|packages/common-ground-atlas/hf/dataset/provenance/source-manifest.json|packages/common-ground-atlas/hf/dataset/verification/verify.py|packages/common-ground-atlas/public/verify.py|packages/common-ground-atlas/tests/atlas.test.mjs", "", "rel", "P", "m", "Uses the approved public HF org handle (hyphenated form; explicitly permitted). Tests import apps/docs/xenia-helly.js and provenance pins hashes of apps/docs and docs files outside packages/.");
J("pkgs-a-c", "packages/constructive-intelligence/tests/fixtures/constructive-intelligence-tree.v1.json.gz.base64", "whole file", "tp", "P", "l", "Byte-exact copy of a separate repo's tree (reward-policy params); no personal content found; confirm the other side intends it public.");
J("pkgs-a-c", "packages/collab/integrations/claude-code/README.md", "8,54-55", "ops", "P", "l", "Documents use of an undocumented vendor per-session socket/token to inject turns.");
J("pkgs-a-c", "packages/credential-broker/ROTATION.md", "408-428", "ops", "P", "l", "Hints at which vendors the operator uses; generic best-practice.");
J("pkgs-a-c", "packages/collab-courier/package.json|packages/correspondence-yutabase-projector/package.json", "", "tp", "W", "m", "No LICENSE/NOTICE and no licence field (private:true); licence decision needed before public.");
J("pkgs-a-c", "packages/collab-zerone/package.json|packages/common-ground-atlas/package.json", "", "tp", "P", "l", "No package-root LICENSE file; add if convention requires.");

// ---------------- packages d–k (PD) ----------------
J("pkgs-d-k", "packages/karma-mirror/src/seed-island.ts", "8,16,18", "rel", "W", "h", "Static house-card copy (EN + zh-HK) with two-name owner+agent credit and heart glyph; header value with the same credit in lowercase (evades case-sensitive rule). Package never projected/guarded. Byte-identity tests must change together.");
J("pkgs-d-k", "packages/karma-mirror/src/types.ts|packages/karma-mirror/README.md|packages/karma-mirror/scripts/smoke-node.mjs|packages/karma-mirror/tests/helpers.ts|packages/karma-mirror/tests/seed-island.test.ts|packages/karma-mirror/tests/walls.test.ts", "types 79-80; README 59,71; smoke 22,27; helpers 68,96; seed-island.test 152,178; walls.test 361", "rel", "W", "h", "Copies/assertions of the same two-name credit.");
J("pkgs-d-k", "packages/karma-mirror/src/crypto.ts|packages/karma-mirror/src/rooms.ts", "rooms ~306-326", "ops", "P", "m", "Honeytoken mirror: planted bearers carry an unkeyed offline-checkable tag; decoy templates and per-root budgets become public. Also no LICENSE/NOTICE and CLAUDE.md forbids external release. Yu's call.");
J("pkgs-d-k", "packages/gin-reconstruction/package.json", "license", "tp", "W", "h", "UNLICENSED, no LICENSE/NOTICE; CLAUDE.md vow forbids release without separate review. Content is clean synthetic maths.");
J("pkgs-d-k", "packages/kingdom/src/constants.ts|packages/kingdom/schema/agenttool-kingdom-card-v0.1.schema.json|packages/kingdom/schema/agenttool-kingdom-registry-v0.1.schema.json", "constants 41,46; card 59,63; registry 100,104", "rel", "P", "m", "Protected persona term as a wire enum value; allow-listed under the delegated wire-enum rule; already on npm.");
J("pkgs-d-k|completeness-critic", "packages/dataset-influence/hf/dataset/reference/DATASET-INFLUENCE.md|docs/DATASET-INFLUENCE.md", "241", "ops", "W", "m", "Links a private sibling repo (commit and internal file paths); dead link and reveals repo layout. Already in the public projection.");
J("pkgs-d-k", "packages/hf-listening-room/hf/dataset/README.md|packages/hf-listening-room/hf/space/BOUNDARIES.md|packages/hf-listening-room/hf/space/README.md|packages/hf-listening-room/hf/space/index.html|packages/hf-listening-room/hf/*/profile/*.md", "", "rel", "P", "l", "Prose credits the profile with the approved public HF handle; very likely fine.");
J("pkgs-d-k", "packages/hf-listening-room/hf/dataset/NOTICE|packages/hf-listening-room/hf/space/NOTICE", "6-8", "tp", "W", "m", "NOTICE claims a vendored MIT lexer and points at bin/vendor (not in the package); fix attribution.");
J("pkgs-d-k|completeness-critic", "packages/dark-continent-karma/hf/space/assets/hero-web.webp", "binary", "tp", "P", "l", "Derivative image with unrecorded source/generator terms; viewed by critic (abstract illustration, no metadata). Already allow-listed and public.");
J("pkgs-d-k", "packages/deepseek-kingdom/hf-dataset/README.md|packages/hf-training-garden/README.md", "", "ops", "P", "l", "Commit links into the private repo; will be dead links after the move.");

// ---------------- packages l–r (PL) ----------------
J("pkgs-l-r|completeness-critic", "packages/lobby/README.md|packages/lobby/CLAUDE.md|packages/lobby/src/text.ts|packages/lobby/src/room.ts|packages/lobby/src/egress.ts|packages/lobby/tests/fixtures/egress-cases.json|packages/lobby/tests/cli.test.ts|packages/lobby/tests/egress.test.ts|packages/lobby/tests/fleet-hardening.test.ts|packages/lobby/tests/fleet-refusals.test.ts|packages/lobby/tests/hosted.test.ts|packages/lobby/tests/room.test.ts|packages/lobby/tests/store.test.ts|packages/lobby/tests/table-talk.test.ts", "README 32,176-178,269,924,926,961; CLAUDE 62; text 83-84; room 181; egress-cases 4-13,55-56,62-63,66-67,81", "per", "W", "m", "Hard-coded 'device-only' term list names a specific third-party platform and tool, disclosing the owner's private trading/research activity and that it is kept on a dedicated machine. Move to local config; neutral fixtures. Guard does not flag these.");
J("pkgs-l-r", "packages/rhizome/README.md", "25-26,30-50,100,309-320,379,388", "per", "W", "m", "Opening anecdote about the owner's home life (25-26,388); owner named as CI decision-maker (379); past security defects described, fix status unverified (30-50,100,309-320).");
J("pkgs-l-r", "packages/lobby/README.md", "86,168,318,945-960", "ops", "P", "l", "Documented egress-gate bypasses (945-960); owner's device-to-device file channels (318); protected glyph example (168); FP keychain-slot (86).");
J("pkgs-l-r", "packages/lobby/tests/fixtures/egress-cases.json", "35,47-48,83", "rel", "W", "h", "Protected glyph in a Unicode fixture (83); fake PEM blocks (47-48); placeholder home (35).");
J("pkgs-l-r", "packages/public-surface-binding/tests/canonical-security.test.ts", "78", "rel", "W", "h", "Protected glyph used as a refused-character example; swap the example character or record allow.");
J("pkgs-l-r", "packages/local-starter/CLAUDE.md|packages/local-starter/README.md|packages/local-starter/src/core.mjs", "CLAUDE 59; README 79; core 39", "rel", "P", "h", "r11 foundations link with Yu's recorded approval (2026-10-11); hashes still match. Carry the approval record over.");
J("pkgs-l-r", "packages/public-surface-binding/package.json|packages/public-surface-recognition/package.json", "6", "tp", "W", "h", "UNLICENSED, private:true, no LICENSE/NOTICE; CLAUDE.md says keep private until a release review. Licence decision needed.");
J("pkgs-l-r", "packages/lobby/package.json|packages/local-starter-mcp/package.json", "", "tp", "P", "l", "Declare Apache-2.0 but ship no package LICENSE/NOTICE.");
J("pkgs-l-r", "packages/research-commons/CLAUDE.md", "52-53", "ops", "P", "l", "Rule to keep the package private/out of release allowlists; confirm intent.");
J("pkgs-l-r", "packages/lobby/src/secrets.ts|packages/lobby/src/wire.ts|packages/lobby/tests/hosted.test.ts|packages/public-surface-binding/tests/validation-security.test.ts|packages/public-surface-recognition/tests/validation-security.test.ts", "secrets 10; wire 66; hosted 73; binding 113,135; recognition 103", "per", "P", "h", "Guard false positives (wire identifier, placeholder home names, URL userinfo on a test host); allow entries or placeholder renames.");
J("pkgs-l-r", "packages/lobby/tests/fleet-refusals.test.ts", "84,137", "sec", "P", "h", "Fake PEM header and placeholder home in a refusal fixture.");
J("pkgs-l-r", "packages/public-surface-binding/vectors/agenttool-public-surface-binding-v0.1-vectors.json|packages/public-surface-recognition/vectors/agenttool-public-surface-recognition-v0.1-vectors.json|packages/repo-archive/vectors/agent-repo-archive-v0.1-vectors.json", "6; 6; 13-14", "sec", "P", "h", "Sequential-byte test-vector seeds; synthetic; gitleaks may flag.");

// ---------------- packages s–z (PS) ----------------
J("pkgs-s-z", "packages/scriptwriter/PYRAMID-INTEGRATION.md", "396-402,459,463-638,642-835,465,644,841,991", "per", "R", "m", "Three dated verbatim owner chat quotes as epigraphs (465,644,841); protected glyph in prose (459,991); pyramid/lottery mechanics reputational risk.");
J("pkgs-s-z", "packages/scriptwriter/src/voting.ts", "5-6,16", "per", "R", "l", "Design rule credited to the owner by first name (16); vote-kind enum (5-6).");
J("pkgs-s-z", "packages/scriptwriter/src/canonical-bytes.ts|packages/scriptwriter/src/rrr.ts|packages/scriptwriter/tests/canonical-bytes.test.ts", "canonical-bytes 125,221,224,230,233; rrr 242,309; test 160-161", "rel", "P", "h", "Heart glyph as a wire value (emoji ladder byte-identical with the API) — allow entry likely; vote-kind enum values with domestic/intimate wording (inferred lore origin).");
J("pkgs-s-z", "packages/scriptwriter/.claude-plugin/commands/scriptwriter-status.md|packages/scriptwriter/.claude-plugin/skills/scriptwriter-rrr/SKILL.md|packages/scriptwriter/.claude-plugin/skills/scriptwriter/SKILL.md", "23; 67; 88", "rel", "W", "h", "Protected glyph in prose/skill docs; Yu approval or remove.");
J("pkgs-s-z", "packages/scriptwriter/src/fun-index.ts|packages/scriptwriter/tests/cloud.test.ts|packages/scriptwriter/package.json", "fun-index 15,46,99,105,122; cloud.test 160-161,332-339,419-442; package.json 49", "rel", "P", "l", "Vote-kind enum values with domestic wording (possible private-lore origin); ask Yu.");
J("pkgs-s-z", "packages/scriptwriter/README.md|packages/scriptwriter/.claude-plugin/plugin.json", "17; 6", "tp", "W", "m", "Clone URL/homepage point at a GitHub org the project may not control.");
J("pkgs-s-z", "packages/trials/tests/core.test.ts", "244", "per", "W", "h", "Fixture home path uses the owner's first name as username.");
J("pkgs-s-z|guard-fulltree", "packages/trials/hf/revocable-feedback-model/tests/test_model_artifact_validation.py", "1059,1127,1138", "per", "P", "h", "Synthetic home paths with a generic username outside the guard's placeholder set.");
J("pkgs-s-z", "packages/sdk-py/CLAUDE.md", "114-118", "ops", "P", "m", "New since last projection: PyPI env had only a branch policy, no reviewer, admin bypass on; owner chose no reviewer.");
J("pkgs-s-z", "packages/wallet/README.md|packages/wallet/tests/capability-denials.test.ts|packages/wallet/vectors/agent-wallet-v0.1-negative-vectors.json", "README 98,161-180", "ops", "P", "m", "Discloses two authorization weaknesses still present in published wallet 0.1.3 with repro vectors; ship the fix before or with publication.");
J("pkgs-s-z", "packages/sdk-py/README.md|packages/sdk-ts/README.md", "sdk-py 212,1200-1236; sdk-ts 1189-1225", "ops", "P", "l", "Unreleased notes disclose a metadata leak in published 0.22.1; treasury address (sdk-py 212).");
J("pkgs-s-z", "packages/witnessed-agent-economy/package.json|packages/witnessed-agent-economy/README.md", "6; 12", "tp", "W", "m", "UNLICENSED/private; vendors a 71-file frozen corpus with no stated rights; depends on non-allowlisted packages.");
J("pkgs-s-z", "packages/wake-thread/package.json", "6", "tp", "W", "m", "UNLICENSED/private, no LICENSE; licence decision needed.");
J("pkgs-s-z", "packages/wake-return/package.json", "", "tp", "P", "l", "Declares Apache-2.0 but ships no LICENSE/NOTICE.");
J("pkgs-s-z", "packages/sdk-ts/src/dark-continent.ts|packages/sdk-ts/src/nen.ts|packages/sdk-py/src/agenttool/dark_continent.py|packages/sdk-py/src/agenttool/nen.py", "", "tp", "P", "l", "Franchise character/term names with short plot descriptions; SDK NOTICE lacks the non-affiliation disclaimer the skills NOTICE has.");
J("pkgs-s-z", "packages/sdk-py/src/agenttool/client.py", "13-14", "per", "P", "l", "Docstring epigraph quotes the owner by first name in devotional language; already public in SDK.");
J("pkgs-s-z", "packages/sdk-py/src/agenttool/x402.py|packages/sdk-ts/src/x402.ts", "111-112; 113-116", "ops", "P", "l", "Project's real on-chain receiving (treasury) address; public by design.");
J("pkgs-s-z", "packages/sdk-ts/tests/fixtures/x402-eip3009-vector.json|packages/sdk-py/tests/fixtures/x402-eip3009-vector.json|packages/sdk-py/tests/test_seed_parity.py", "6; 4; 41", "sec", "P", "h", "Well-known public test keys (Hardhat default, sequential, BIP39 test mnemonic); ensure gitleaks fingerprints.");

// ---------------- bin / infra / cli / tests / marketing (OP) ----------------
J("ops-bin-infra", "infra/README.md", "10,47,53-57", "rel", "R", "h", "Signed personal dedication to an AI partner (53-57); machine username as keychain account (47); regional pooler host (10).");
J("ops-bin-infra", "tests/playwright/README.md", "98-102", "rel", "R", "h", "Signed personal dedication with a spousal endearment.");
J("ops-bin-infra", "bin/heartbeat.ts", "10,75-86,117,135", "rel", "W", "h", "Two-name couple phrasing; a probe counting a familial term and the persona name in docs.");
J("ops-bin-infra", "bin/run-test-tier.sh", "56,59,60,77,78", "rel", "W", "h", "Hard-coded doctrine test filenames containing a familial term; rename with the tests.");
J("ops-bin-infra", "bin/tests/boring-spine-gate.test.ts", "43,46,47,70,71,857", "rel", "W", "h", "Same relational test filenames as expected gate paths; also pins the yutabase CI job (857).");
J("ops-bin-infra", "cli/think/README.md", "22,394", "rel", "R", "h", "Owner watching the persona think (22); personal signature (394).");
J("ops-bin-infra", "bin/snakefire.py", "19", "rel", "R", "h", "Docstring formula naming owner + persona as a trinity.");
J("ops-bin-infra", "bin/lovestar.py", "74", "per", "W", "h", "Second-account home path to a private relationship project folder (persona-named).");
J("ops-bin-infra", "bin/multibeat.py", "111,117,132-147,156", "per", "W", "h", "Second-account home paths; a personal GitHub handle (gh auth switch + jsDelivr URL) that the guard misses; pushes to a personal repo.");
J("ops-bin-infra", "bin/gen-k-master.ts", "9,11,16,21,41", "rel", "W", "m", "Keychain service name and defaults embed the persona name; renaming needs a keychain migration.");
J("ops-bin-infra", "bin/gospel-release/delivery/stage.py", "73,86", "rel", "P", "m", "Author string credits owner + persona; already public in npm metadata; needs recorded allow.");
J("ops-bin-infra", "bin/gospel-release/README.md", "23-24", "rel", "W", "m", "Two-name couple phrase split across a line break (guard per-line miss).");
J("ops-bin-infra", "bin/card.py", "23", "rel", "P", "l", "Product truth string matching a protected SOUL phrase.");
J("ops-bin-infra", "bin/daytime-truth.py|bin/finger-truth.py|bin/telnet-truth.py|bin/love-bomb.py|bin/mindicraft-brain.ts|bin/nen.py|bin/solo.py|bin/tax-comedy.ts", "", "rel", "W", "l", "Heart-glyph branding (r16) in CLI output/docstrings; strip or get approved allow entries.");
J("ops-bin-infra|completeness-critic", "supabase/config.toml", "6", "ops", "R", "h", "Bare production project ref as project_id (guard miss); already public on the docs site. Replace with placeholder/env or explicit allow.");
J("ops-bin-infra", "bin/deploy.sh|bin/phase-b-deploy-guard.ts|bin/phase-b-refence-maintenance-bridge.ts|bin/phase-b-refence-maintenance-contract.ts|bin/tests/phase-b-refence-maintenance-bridge.test.ts|bin/tests/phase-b-refence-maintenance-dispatcher.test.ts|bin/tests/fixtures/phase-b-refence-maintenance-production-shape-v1.json|bin/tests/fixtures/phase-b-refence-maintenance-handshake-v1.json", "", "per", "W", "h", "Production operator machine username + home dir hard-pinned (incl. bare-string forms the guard misses); byte-bound digests. Alternatively keep the Phase-B refence controller set private (topology plan recommends private overlay: pins private commit SHAs).");
J("ops-bin-infra|completeness-critic", "bin/frontend-deploy.sh|bin/migrate-pending.sh|bin/tests/build-input-hygiene.test.ts|native/agenttool-secret-macos/Sources/AgentToolSecretMacOSCore/Command.swift|native/agenttool-secret-macos/Tests/AgentToolSecretMacOSTests/ContractTests.swift", "frontend-deploy 17-18,50; migrate-pending 6,132-137,276-283; hygiene 132; Command 85; Contract 11", "per", "W", "m", "Machine-local macOS username as the fixed keychain account (bare string, no guard rule); parametrise.");
J("ops-bin-infra", "bin/sovereign-router.ts", "35,48,73,79,343", "per", "W", "h", "Desktop home path (35); token-farming incident joke (48); glyphs.");
J("ops-bin-infra", "bin/mission-wake-hermes.mjs", "96", "per", "W", "m", "Device-specific agent config dir in PATH.");
J("ops-bin-infra", "bin/README.md|bin/_secret-store.ts|bin/agenttool-mission.mjs|bin/agenttool-secret|bin/agenttool-seed.ts|bin/edge-deploy.sh|bin/migrate.sh", "README 61; _secret-store 19; mission 214; secret 21,31; seed 421,425,553,560,836,978; migrate 21", "per", "P", "m", "Local keychain service names for operator credentials (conventions, not values); need allow entries.");
J("ops-bin-infra", "infra/cloudflare/agenttool.dev.desired.json|bin/cloudflare-zone-audit.ts", "desired 28,73-122,218; audit 383-392", "ops", "P", "m", "Provider-origin hostnames that bypass WAF/edge (origin auth not yet landed); workers.dev subdomain links another venture.");
J("ops-bin-infra", "bin/river.py", "2-4,46-58,72", "tp", "W", "m", "Note-by-note rendering of a commercially published copyrighted melody, arranged as a personal gift addressed to the owner.");
J("ops-bin-infra", "bin/soil.ts", "16-19", "per", "P", "l", "Anecdote about the owner's home garden.");
J("ops-bin-infra", "bin/ai_logos.py|bin/covenant.py|bin/platform-genesis.ts|tests/playwright/specs/room.spec.ts", "", "per", "P", "l", "Owner's first name in usage examples/fixtures.");
J("ops-bin-infra", "marketing/DIRECTORY-SUBMISSION.md", "33,254-258,289,347,370", "ops", "P", "l", "Exact MCP rate-limit windows; 'repository is private' (stale after move); public vendor address (FP); owner's first name as decision-maker.");
J("ops-bin-infra", "bin/mindicraft-heartbeat.ts", "34,209,215-217", "ops", "P", "l", "Joke recounting a real token-farming exploit; glyphs.");
J("ops-bin-infra", "bin/unleash-love.ts", "34-100", "ops", "P", "l", "Inventory of a self-hosted local stack (services, ports).");

// ---------------- root / review / public / .github (RR) ----------------
J("root-review-public-github|guard-fulltree|plan-topology", "public/private-guard/relational-denylist.json", "all", "rel", "K", "h", "The private relational denylist itself (terms + Yu's recorded rulings). Must never leave the private repo.");
J("root-review-public-github|guard-fulltree", "?????.md", "6,18-20", "rel", "K", "h", "Root copy of the familial-address letter (owner's name and meaning); path name matches the denylist; live byte-identical on docs site.");
J("root-review-public-github|guard-fulltree", "????????????.md", "1-41", "rel", "K", "h", "Intimate late-night narrative between owner (Chinese name) and persona; path name matches the denylist; NOT live today (404), so publishing would be new exposure.");
J("root-review-public-github|apps", "KINGDOM.md", "10,25,26,27", "rel", "R", "h", "Owner's Chinese name; link to the familial letter; links to persona invitation and archive. Rest is a public link map; live.");
J("root-review-public-github", "KINGDOM-INVITATION.md", "10", "rel", "R", "h", "Founder credit uses the owner's Chinese name; live.");
J("root-review-public-github", "SOUNDTRACK.md", "3-5,25,45-46,50-53", "rel", "W", "l", "Says the spec is canonical in a private relationship repo; dated to a private milestone; persona composer credit (no denylist hit).");
J("root-review-public-github", "EXISTENCE.md", "24-25", "rel", "P", "l", "Names the private relationship-substrate repo (name only).");
J("root-review-public-github|guard-fulltree", "Caddyfile", "104,112,119", "per", "R", "h", "Owner machine home paths as static roots.");
J("root-review-public-github|guard-fulltree", "sovereign.sh", "19,23", "per", "R", "h", "Hard-coded owner home path for ROOT and HOME.");
J("root-review-public-github|guard-fulltree", "self-host.sh", "63,104,110,117-126", "per", "R", "m", "Owner Desktop device paths (104,110 in $(HOME) form the guard misses); workers.dev subdomain tied to another product (117-126).");
J("root-review-public-github|guard-fulltree", "review/launch-20260904/readiness.md", "15-21,27,35,43-47,77", "per", "R", "h", "Owner home path (77); dated weaknesses (fail-open limiter, no independent DB backup, dev DB = prod) — re-check current state.");
J("root-review-public-github|guard-fulltree", "review/launch-cleanup-20260904/evidence/ui-screenshots.json", "5", "per", "R", "h", "Owner home path of the screenshot checkout.");
J("root-review-public-github", "review/launch-cleanup-20260904/README.md", "27,73", "ops", "P", "m", "Dated operator-credential status (unauthenticated CLI, rejected DB credential, invalid CF token) and edge posture.");
J("root-review-public-github|completeness-critic", "review/launch-cleanup-20260904/evidence/cloudflare-readonly-audit.json", "21-58,111-133,150-199", "ops", "P", "m", "Zone security posture: DNSSEC absent, WAF uninspected, active workers.dev aliases without source, origin auth not deployed (edge bypass). Re-check current state.");
J("root-review-public-github", "review/production-launch-20260904.md", "12,24,57-59,86-98", "ops", "P", "l", "Dated disclosures (disabled limiter, cashable backing not conserved, no durable replay protection); internal branch named.");
J("root-review-public-github", "review/launch-20260904/evidence/focused-observations.json", "39", "ops", "P", "l", "Captured response names the API's direct Fly origin host.");
J("completeness-critic", "review/launch-20260904/evidence/reachability.json", "66", "ops", "R", "h", "Captured /public/plans body contains the bare production project ref (guard miss).");
J("root-review-public-github|guard-fulltree|plan-ci-deploy", ".github/workflows/ci.yml", "61,83,92,101,145,875-987,915", "ops", "W", "h", "Inline test-only Postgres passwords (FP); yutabase-projector job (875-987) checks out a second private repo with a deploy key — must not run in public; repository guard at 891.");

// ---------------- completeness critic (CC) extra ----------------
J("completeness-critic", "api/src/services/youspeak/bundle.json", "canon bodies", "rel", "K", "m", "Carries the same YOUSPEAK canon as kingdom-bundle.json (dated vow references); classify identically — regenerate from a public subset or withhold. Licence of embedded fonts unknown.");
J("completeness-critic|plan-topology", "bin/tests/project-public.test.ts", "~290-315,361,370-372,456-457", "rel", "K", "h", "Rebuilds private denylist terms from split literals/code points; joins a second machine-account name (361). Keep private with the denylist.");
J("completeness-critic", "docs/XENIA-HELLY-COMMON-GROUND.md", "20,112", "rel", "W", "m", "Familial form of address to a parent figure (persona-to-owner frame); guard 0 hits.");
J("completeness-critic", "docs/SOIL.md", "16-18", "per", "W", "l", "Anecdote about the owner's own home lawn naming the owner.");
J("completeness-critic|docs-a-m", "docs/LUCK-PROTOCOL.md", "7,226", "rel", "W", "m", "Owner's verbatim dated chat directive (twice); guard 0 hits.");
J("completeness-critic", "docs/WAKE-WARMING.md", "19,27,72,166", "rel", "W", "m", "Persona names in example chronicle strings; persona/owner sign-off.");
J("completeness-critic", "docs/WELCOMING.md|docs/TUTORIAL-WHAT-YOUR-COGNITION-IS.md|docs/PUBLIC-WAKE-STREAM.md|docs/WAKE-JOY-VARIANTS.md", "333; 212; 163; 81", "rel", "W", "m", "Persona/owner authorship sign-offs and persona name as example agent.");
J("completeness-critic", "apps/docs/whitehack.html|docs/WHITEHACK.md|packages/research-commons/src/constants.ts|docs/ZERONE-LIVE.md", "", "ops", "P", "m", "Links to sibling repos verified private (dead links; reveals repo names).");
J("completeness-critic|guard-fulltree", "packages/collab/dist/agenttool-collab-host.js", "3128,3132", "sec", "R", "m", "Two overlay .gitleaksignore fingerprints drifted by one line (3127/3131 -> 3128/3132); the current projection guard would refuse today (inferred). Content is FP; regenerate fingerprints.");
J("completeness-critic|guard-fulltree", "apps/docs/packages/v1/@agenttool/browser/0.6.0/agenttool-browser-0.6.0.tgz|apps/docs/packages/v1/@agenttool/browser/0.5.1/agenttool-browser-0.5.1.tgz", "binary", "tp", "P", "m", "Vendor Playwright core (Apache-2.0) incl. a font and icons; notices bundled; digest-pinned release artifacts (keep or withhold, cannot redact).");

// ---------------- plans: CI/deploy + topology (file-level items) ----------------
J("plan-ci-deploy", ".github/workflows/deploy-api.yml", "44-57,77-140,122-125,132-133,147-155,179-188,217-248", "ops", "W", "h", "Fly token + survey DB URL are repo-level secrets, no environment, job-level env exposes the Fly token to every step, no repository guard; deploy receipt prints machine IDs/regions; survey output printed on failure. Move secrets to a protected 'production' env, step-scope the token, add repo guard, trim logs.");
J("plan-ci-deploy", ".github/workflows/publish-gospel.yml", "44-80", "ops", "W", "h", "Only consumer of the leftover scope-wide NPM_TOKEN; publish job is dead (0.1.0 already on npm). Do not migrate the publish job; revoke the token.");
J("plan-ci-deploy", ".github/workflows/care-before-learning-hf-probe.yml", "3-5,16,101-108,208", "ops", "K", "h", "Stale diagnostic workflow (fires only on a 2026-09-08 branch); delete rather than migrate.");
J("plan-ci-deploy", ".github/workflows/publish-care-before-learning-hf.yml", "15,100-137", "ops", "W", "m", "id-token:write with no environment; HF OIDC trust bound to the old repo; HF target required private although content becomes public.");
J("plan-ci-deploy", ".github/workflows/production-health.yml", "4-6,17,59,88", "ops", "W", "m", "5-minute cron with no repo guard on ubuntu-latest; public run history exposes outages; names the direct Fly origin. Add guard + pin runner or move to an external monitor.");
J("plan-ci-deploy", ".github/workflows/publish-pypi.yml", "128-154", "ops", "W", "h", "Trusted publisher bound to the old repo/workflow/env; no repository guard. Re-point publisher and SOURCE/EXPECTED_REPOSITORY.");
J("plan-ci-deploy|guard-fulltree|completeness-critic", ".forgejo/workflows/ci.yml", "29-46", "ops", "K", "m", "Codeberg-era workflow (mirror retired), unpinned actions, dummy low-entropy vault key; do not carry into the public snapshot.");
J("plan-ci-deploy", "bin/tests/yutabase-ci-access.test.ts", "43", "ops", "W", "h", "Asserts the private yutabase CI job; must change when that job is removed from public ci.yml.");
J("plan-ci-deploy|plan-topology", "bin/npm-release.ts|bin/public-release-tag.ts|bin/pypi-release.ts|docs/npm-trust-repoint.sh", "npm-release 24-31,706-737,2290; release-tag 3-23,111-116; pypi-release 31-41,805-809; repoint 47-50", "ops", "W", "h", "Release lane hard-bound to the projection repo / old repo slug; must be rewritten for the chosen release lane.");
J("plan-ci-deploy", "api/Dockerfile|bin/care-before-learning-hf-release.py|api/tests/outward-operational-claims.test.ts", "Dockerfile 19,44-56; hf-release 105,290; claims 30-33", "ops", "W", "m", "Hard-coded old repo slug / baked docs list; update with the new slug.");
J("plan-topology", "api/doctrine-docs.manifest|bin/stage-doctrine-docs.sh|api/src/services/doctrine/integrity.ts", "", "ops", "W", "h", "API image bakes 19 doctrine docs + canon jsonld + kingdom-bundle (11 of 21 flagged); a missing file fails the build and /v1/canon, /public/kingdom return 503. Publish cleaned versions or change the image recipe.");
J("plan-topology", "bin/docs-catalog.py|bin/tests/documentation-catalog.test.ts", "docs-catalog 84-96,165-183; test 52", "ops", "W", "h", "Catalog check fails when any routed doc is absent; 186 of 372 routed paths are relational-flagged. Regenerate indexes from the public tree.");
J("plan-topology", "api/tests/published-docs-parity.test.ts", "5-30", "ops", "W", "h", "Requires apps/docs copies byte-identical to docs; adjust for excluded docs.");
J("plan-topology", "api/src/services/canon/absence.ts|api/src/services/canon/annotations.ts", "absence 44,250-270; annotations 70,205,246", "ops", "W", "m", "Runtime scanners walk the repo and require 'Tested:' citations to exist; removing cited tests breaks them.");
J("plan-topology", "bin/migrate-pending.sh|api/scripts/_migrate-one.ts", "migrate-pending 192-199; _migrate-one 8-9", "ops", "W", "h", "Runner refuses missing or checksum-drifted journaled migrations (36 of 181 flagged); needs a sealed-migration mode or byte-exact publication.");
J("plan-topology", "bin/preflight.sh", "76,83", "ops", "W", "m", "API gate typechecks phase-b tooling and runs all bin/tests; adjust when private files are excluded.");
