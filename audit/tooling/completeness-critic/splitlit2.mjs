import { readFileSync } from "node:fs";
const [, , dl, file, rid] = process.argv;
const d = JSON.parse(readFileSync(dl, "utf8"));
const r = d.terms.find((t) => t.id === rid); const re = new RegExp(r.pattern, (r.flags || "").replace("g", ""));
const src = readFileSync(file, "utf8");
const lits = [...src.matchAll(/(["'`])((?:\\.|(?!\1).){1,40})\1/g)].map((m) => ({ s: m[2], i: m.index, e: m.index + m[0].length }));
for (let k = 0; k < lits.length; k++) { let acc = lits[k].s;
  for (let j = k + 1; j < Math.min(lits.length, k + 6); j++) { const gap = src.slice(lits[j - 1].e, lits[j].i); if (!/^\s*(\+|,)\s*$/.test(gap)) break; acc += lits[j].s;
    if (re.test(acc)) { const line = src.slice(0, lits[k].i).split("\n").length; console.log("line", line, "pieces", j - k + 1, "piece-lengths", lits.slice(k, j + 1).map((x) => x.s.length).join("/")); break; } } }
