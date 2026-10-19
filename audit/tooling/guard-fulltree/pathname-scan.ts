#!/usr/bin/env bun
/** Applies secret/personal/relational rules to the tracked PATH STRINGS (file names are public too). Ids only. */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { git, gitText, PERSONAL_RULES, scanText, SECRET_RULES } from "../guard/public/overlay/tools/public-guard.ts";
import { DENYLIST_PATH, parseDenylist } from "../guard/bin/project-public.ts";

const [repo, outDir] = process.argv.slice(2) as [string, string];
const deny = parseDenylist(git(repo, ["cat-file", "blob", `HEAD:${DENYLIST_PATH}`]).stdout);
const paths = gitText(repo, ["ls-files", "-z"]).split("\0").filter(Boolean);
const text = paths.join("\n");
const findings = scanText("(paths)", text, [...SECRET_RULES, ...PERSONAL_RULES, ...deny.rules]).map((f) => ({ rule: f.rule, path: paths[(f.line ?? 1) - 1] }));
writeFileSync(join(outDir, "pathname-findings.json"), `${JSON.stringify(findings, null, 1)}\n`);
const byRule = new Map<string, number>();
for (const f of findings) byRule.set(f.rule, (byRule.get(f.rule) ?? 0) + 1);
console.log(`paths ${paths.length}, findings ${findings.length}`, [...byRule]);
