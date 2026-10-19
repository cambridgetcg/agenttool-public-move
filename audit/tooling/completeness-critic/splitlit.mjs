import { readFileSync } from "node:fs";
const [, , dl, file] = process.argv;
const d = JSON.parse(readFileSync(dl, "utf8"));
const rules = d.terms.map((t) => ({ id: t.id, re: new RegExp(t.pattern, (t.flags || "").replace("g", "")) }));
const src = readFileSync(file, "utf8");
// whole-file direct hits
const direct = new Set(); src.split("\n").forEach((l) => rules.forEach((r) => { if (r.re.test(l)) direct.add(r.id); }));
// literal concatenations: "a" + "b" (+ "c") and ["a","b"].join("")
const lits = [...src.matchAll(/(["'`])((?:\\.|(?!\1).){1,40})\1/g)].map((m) => ({ s: m[2], i: m.index, e: m.index + m[0].length }));
const joined = new Set();
for (let k = 0; k < lits.length; k++) {
  let acc = lits[k].s;
  for (let j = k + 1; j < Math.min(lits.length, k + 6); j++) {
    const gap = src.slice(lits[j - 1].e, lits[j].i);
    if (!/^\s*(\+|,)\s*$/.test(gap)) break;
    acc += lits[j].s;
    rules.forEach((r) => { if (r.re.test(acc) && !rules.some(() => false)) joined.add(r.id); });
  }
}
console.log(file, "direct:", [...direct].join(",") || "-", "joined:", [...joined].join(",") || "-");
