import { readFileSync } from "node:fs";
import { maskPath } from "./mask.mjs";
const tracked = readFileSync(process.argv[2], "utf8").split("\n").filter(Boolean);
let n = 0; const masked = [];
for (const p of tracked) { const r = maskPath(p); if (r.masked) { n++; masked.push(r.path); } }
console.log("masked", n);
const top = {}; for (const m of masked) { const k = m.split("/").slice(0, 2).join("/"); top[k] = (top[k] || 0) + 1; }
console.log(top);
console.log(masked.filter(m=>!m.startsWith("api/migrations")).slice(0, 200).join("\n"));
