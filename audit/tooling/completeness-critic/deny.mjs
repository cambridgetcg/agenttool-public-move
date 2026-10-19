// Usage: node deny.mjs <denylist.json> <root> <file>...  -> path:line:rule (no terms printed)
import { readFileSync } from "node:fs";
import { join } from "node:path";
const [, , dl, root, ...files] = process.argv;
const d = JSON.parse(readFileSync(dl, "utf8"));
const rules = d.terms.map((t) => ({ id: t.id, re: new RegExp(t.pattern, (t.flags || "").includes("g") ? t.flags : (t.flags || "") + "g") }));
for (const f of files) {
  let text;
  try { text = readFileSync(join(root, f), "utf8"); } catch { continue; }
  text.split("\n").forEach((line, i) => {
    const vs = new Set([line, line.normalize("NFC"), line.normalize("NFKC")]);
    const ids = new Set();
    for (const v of vs) for (const r of rules) { r.re.lastIndex = 0; if (r.re.test(v)) ids.add(r.id); }
    if (ids.size) console.log(`${f}:${i + 1}:${[...ids].join(",")}`);
  });
}
