// Leak check over output files: denylist (strict+loose), other home-account names, project ref, emails, guard personal/secret rules.
import { readFileSync } from "node:fs";
import { textHits } from "./mask.mjs";
const SRC = "/Users/macair/agenttool-wt-1019/audit-src";
const guard = await import(new URL("../guard-fulltree/guard/public/overlay/tools/public-guard.ts", import.meta.url).href).catch(() => null);
const names = readFileSync(new URL("./homenames.private.txt", import.meta.url), "utf8").split("\n").filter((n) => n && n !== "macair" && n.length >= 4 && !/^(example|Example|person|someone|runner|Shared|user|USER|username|you|me|alice|bob|dev|name|NAME|demo|test|agent|private)$/.test(n));
const cfg = readFileSync(SRC + "/supabase/config.toml", "utf8").split("\n")[5];
const ref = (cfg.match(/"([a-z0-9]{15,})"/) || [])[1];
for (const f of process.argv.slice(2)) {
  const t = readFileSync(f, "utf8");
  const dh = textHits(t);
  const nameHits = names.filter((n) => new RegExp("(^|[^A-Za-z0-9])" + n.replace(/[.]/g, "\\.") + "([^A-Za-z0-9]|$)").test(t)).length;
  const refHit = ref ? t.split(ref).length - 1 : "noref";
  const emails = (t.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).filter((e) => !/noreply@anthropic\.com/.test(e));
  let g = [];
  if (guard) { try { g = guard.scanText(f, t, [...guard.SECRET_RULES, ...guard.PERSONAL_RULES]).map((h) => h.rule + "@" + h.line); } catch (e) { g = ["scan-error " + e.message]; } }
  console.log(f.split("/").pop(), JSON.stringify({ denylist: dh.map((h) => h.rule + ":" + h.kind + "@" + h.line), otherHomeNames: nameHits, projectRef: refHit, emails: emails.length, guard: g.slice(0, 30), guardTotal: g.length }));
}
