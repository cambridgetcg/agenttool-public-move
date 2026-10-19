// Masks relational denylist terms in path strings / text. Never prints terms.
import { readFileSync } from "node:fs";
const D = JSON.parse(readFileSync(new URL("./denylist.private.json", import.meta.url), "utf8"));
const mk = (src, flags) => new RegExp(src, flags.includes("g") ? flags : flags + "g");
export const RULES = D.terms.map((t) => ({
  id: t.id,
  strict: mk(t.pattern, t.flags || ""),
  loose: mk(t.pattern.replace(/\\b/g, ""), t.flags || ""),
}));
function spans(re, s) {
  const out = []; re.lastIndex = 0; let m;
  while ((m = re.exec(s))) { if (m[0].length === 0) { re.lastIndex++; continue; } out.push([m.index, m.index + m[0].length]); }
  return out;
}
export function maskSegment(seg) {
  const norm = seg.replace(/[_\-.]/g, " ");
  const all = [];
  for (const r of RULES) { all.push(...spans(r.strict, norm), ...spans(r.strict, seg.normalize("NFKC") === seg ? seg : seg), ...spans(r.loose, seg)); }
  if (!all.length) return { seg, hit: false };
  const mark = new Array(seg.length).fill(false);
  for (const [a, b] of all) for (let i = a; i < b && i < seg.length; i++) mark[i] = true;
  let out = ""; for (let i = 0; i < seg.length; i++) { if (mark[i]) { out += "?"; } else out += seg[i]; }
  return { seg: out, hit: true };
}
export function maskPath(p) {
  let hit = false;
  const segs = p.split("/").map((s) => { const r = maskSegment(s); hit ||= r.hit; return r.seg; });
  return { path: segs.join("/"), masked: hit };
}
export function textHits(text) {
  const hits = [];
  text.split("\n").forEach((line, i) => {
    for (const v of new Set([line, line.normalize("NFKC"), line.replace(/[_\-]/g, " ")])) for (const r of RULES) {
      r.strict.lastIndex = 0; if (r.strict.test(v)) hits.push({ line: i + 1, rule: r.id, kind: "strict" });
      r.loose.lastIndex = 0; if (r.loose.test(v)) hits.push({ line: i + 1, rule: r.id, kind: "loose" });
    }
  });
  return hits;
}
