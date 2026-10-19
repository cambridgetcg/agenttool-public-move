#!/usr/bin/env bun
/** Guard content layers (secret, personal, relational) over extracted tarball contents. Ids/paths/lines only. */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { contentFindings, gitText, PERSONAL_RULES, SECRET_RULES, git } from "../guard/public/overlay/tools/public-guard.ts";
import { DENYLIST_PATH, parseDenylist } from "../guard/bin/project-public.ts";

const [repo, root, outDir] = process.argv.slice(2) as [string, string, string];
const deny = parseDenylist(git(repo, ["cat-file", "blob", `HEAD:${DENYLIST_PATH}`]).stdout);
void gitText;
const blobs: Array<{ path: string; bytes: Uint8Array }> = [];
const walk = (dir: string) => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else if (st.isFile()) blobs.push({ path: relative(root, full), bytes: readFileSync(full) });
  }
};
walk(root);
const findings = contentFindings(blobs, [...SECRET_RULES, ...PERSONAL_RULES, ...deny.rules]);
writeFileSync(join(outDir, "tgz-findings.json"), `${JSON.stringify(findings, null, 1)}\n`);
const by = new Map<string, number>();
for (const f of findings) {
  const pkg = f.path.split("/").slice(0, 3).join("/");
  const key = `${f.rule}\t${pkg.split("/").slice(0, 2).join("/")}`;
  by.set(key, (by.get(key) ?? 0) + 1);
}
console.log(`files ${blobs.length}, findings ${findings.length}`);
for (const [k, v] of [...by].sort()) console.log(v, k);
