// Synthesises the per-path manifest from scanner outputs + transcribed judgment flags.
// Prints only masked paths and counts. Never prints denylist terms or matched text.
import { readFileSync, writeFileSync, lstatSync, readlinkSync } from "node:fs";
import { posix } from "node:path";
import { maskPath, RULES } from "./mask.mjs";
import { J_ROWS } from "./judg.mjs";

const A = "/private/tmp/claude-501/-Users-macair/dff54175-f190-4444-a992-3cfe8aaacfa0/scratchpad/public-audit";
const SRC = "/Users/macair/agenttool-wt-1019/audit-src";
const OUT = A + "/final";
const tracked = readFileSync(A + "/guard-fulltree/out/tracked.txt", "utf8").split("\n").filter(Boolean);
const trackedSet = new Set(tracked);
const symlinks = new Set(tracked.filter((p) => { try { return lstatSync(SRC + "/" + p).isSymbolicLink(); } catch { return false; } }));

const CAT = { sec: "secret", per: "personal", rel: "relational", tp: "third_party", ops: "ops_sensitive" };
const ACT = { K: "keep_private_whole_file", W: "rewrite", R: "redact_lines", P: "publish_ok_after_review" };
const ACT_RANK = { keep_private_whole_file: 4, rewrite: 3, redact_lines: 2, publish_ok_after_review: 1 };
const CAT_RANK = { relational: 5, personal: 4, secret: 3, third_party: 2, ops_sensitive: 1 };
const CONF = { h: "high", m: "medium", l: "low" };
const CONF_RANK = { high: 3, medium: 2, low: 1 };

// ---- text masking for notes (masks any denylist match, strict-normalised or loose) ----
function maskText(s) {
  if (!s) return s;
  const variants = [s, s.replace(/[_\-]/g, " ")];
  const mark = new Array(s.length).fill(false);
  for (const v of variants) for (const r of RULES) for (const re of [r.strict, r.loose]) {
    re.lastIndex = 0; let m;
    while ((m = re.exec(v))) { if (!m[0].length) { re.lastIndex++; continue; } for (let i = m.index; i < m.index + m[0].length && i < s.length; i++) mark[i] = true; }
  }
  let out = ""; for (let i = 0; i < s.length; i++) out += mark[i] ? "?" : s[i];
  return out;
}

// ---- glob resolution ----
const globRe = (g) => new RegExp("^" + g.split(/(\*\*\/|\*\*|\*|\?|\{[^}]*\})/).map((t) => {
  if (t === "**/") return "(?:.*/)?"; if (t === "**") return ".*"; if (t === "*") return "[^/]*"; if (t === "?") return "[^/]";
  if (t.startsWith("{")) return "(?:" + t.slice(1, -1).split(",").map((x) => x.replace(/[.+^$()|[\]\\]/g, "\\$&")).join("|") + ")";
  return t.replace(/[.+^$()|[\]\\{}]/g, "\\$&");
}).join("") + "$");
const maskedIndex = new Map();
for (const p of tracked) { const m = maskPath(p); if (m.masked) maskedIndex.set(m.path, p); }
const unresolved = [];
function resolve(pat) {
  if (trackedSet.has(pat)) return [pat];
  if (maskedIndex.has(pat)) return [maskedIndex.get(pat)];
  if (/[*?{]/.test(pat)) { const re = globRe(pat); const r = tracked.filter((p) => re.test(p)); if (r.length) return r; }
  // directory prefix
  const pre = tracked.filter((p) => p.startsWith(pat.replace(/\/$/, "") + "/"));
  if (pre.length && !/[*?{]/.test(pat)) return [{ dir: pat, files: pre.length }];
  unresolved.push(maskPath(pat).path); return [];
}

// ---- guard full-tree findings ----
const findings = JSON.parse(readFileSync(A + "/guard-fulltree/out/fulltree-findings.json", "utf8"));
const guard = new Map();
for (const f of findings) {
  const g = guard.get(f.path) ?? { unapproved: 0, approved: 0, rules: {}, lines: new Set(), layers: new Set() };
  if (f.allowedBy) g.approved++; else g.unapproved++;
  g.rules[f.rule] = (g.rules[f.rule] ?? 0) + 1; g.layers.add(f.layer); if (f.line) g.lines.add(f.line);
  guard.set(f.path, g);
}
const gitleaks = JSON.parse(readFileSync(A + "/guard-fulltree/out/gitleaks-findings-stripped.json", "utf8"));
const glByPath = new Map();
for (const g of (Array.isArray(gitleaks) ? gitleaks : gitleaks.findings ?? [])) {
  const p = (g.File ?? g.file ?? g.path ?? "").replace(SRC + "/", ""); if (!p) continue;
  const e = glByPath.get(p) ?? { findings: 0 }; e.findings++; glByPath.set(p, e);
}

// ---- rows ----
const rows = []; // {path, s, c, a, k, l, n}
const areaFlags = [];
const push = (path, s, c, a, k, l, n) => rows.push({ path, s, c, a, k, l, n });

// GF per-file flags
const gf = JSON.parse(readFileSync(A + "/guard-fulltree/out/flags-final2.json", "utf8"));
const gfDescNote = (d) => d.replace(/:\s*$/, "");
for (const x of gf) {
  if (trackedSet.has(x.path)) { push(x.path, "guard-fulltree", x.category, x.action, x.confidence, x.lines ?? "", "mechanical: " + gfDescNote(x.description)); continue; }
  // grouped entries: extract path[:lines] tokens
  const toks = [...x.description.matchAll(/([A-Za-z0-9_.@\/-]+\.[A-Za-z0-9]+)(?::([0-9,\-]+))?/g)];
  let hit = 0;
  const base = x.path === "(multiple)" ? "" : x.path.replace(/\/$/, "") + "/";
  for (const t of toks) {
    const cand = [t[1], base + t[1]].find((c) => trackedSet.has(c));
    if (cand) { hit++; push(cand, "guard-fulltree", x.category, x.action, x.confidence, t[2] ?? "", "mechanical (grouped): " + x.description.split(/[;:(]/)[0].trim()); }
  }
  if (!hit || x.path !== "(multiple)") areaFlags.push({ path: maskPath(x.path).path, category: x.category, action: x.action, confidence: x.confidence, sources: ["guard-fulltree"], note: maskText(x.description.slice(0, 600)) });
}
// GF symlink path findings not yet covered
for (const f of findings) if (f.layer === "path" && f.rule === "path/symlink" && !rows.some((r) => r.path === f.path))
  push(f.path, "guard-fulltree", "ops_sensitive", "publish_ok_after_review", "medium", "", "Relative in-repo symlink; guard path layer refuses symlinks. Materialise the target (if the target doc is public) or drop the link; never let it re-expose a doc kept private.");

push("public/overlay/.gitleaksignore", "guard-fulltree", "ops_sensitive", "rewrite", "high", "", "Nested .gitleaksignore is part of the projection-overlay design (guard path rule fires outside the projection). Two fingerprints for packages/collab dist drifted by one line; regenerate. In the new repo decide where the ignore file lives (repo root).");
// judgment rows
for (const j of J_ROWS) for (const pat of j.p) for (const r of resolve(pat)) {
  if (typeof r === "string") for (const s of j.s.split("|")) push(r, s, CAT[j.c], ACT[j.a], CONF[j.k], j.l ?? "", j.n);
  else areaFlags.push({ path: maskPath(r.dir).path, category: CAT[j.c], action: ACT[j.a], confidence: CONF[j.k], sources: j.s.split("|"), note: maskText(j.n) });
}
// critic: relational path names
for (const p of readFileSync(A + "/completeness-critic/out/relational-pathnames.txt", "utf8").split("\n").filter(Boolean)) {
  if (!trackedSet.has(p)) { unresolved.push(maskPath(p).path); continue; }
  push(p, "completeness-critic", "relational", "rewrite", "high", "path name", "Path name itself carries persona/owner/intimate wording (guard path scan misses underscore/hyphen-joined forms); a content rewrite still leaks through the name — rename or keep private.");
}
// critic: bare machine-account name lines
const acct = new Map();
for (const ln of readFileSync(A + "/completeness-critic/out/acct-bare.txt", "utf8").split("\n").filter(Boolean)) {
  const m = ln.match(/^([^:]+):(\d+)/); if (!m || !trackedSet.has(m[1])) continue;
  (acct.get(m[1]) ?? acct.set(m[1], []).get(m[1])).push(m[2]);
}
for (const [p, ls] of acct) push(p, "completeness-critic", "personal", "redact_lines", "high", [...new Set(ls)].join(","), "Owner's machine-local account name in bare form (keychain -a args, account= prose, constants, dashed encodings); no guard rule catches it. Replace with $USER/env/placeholder.");

// ---- merge ----
const byPath = new Map();
for (const r of rows) (byPath.get(r.path) ?? byPath.set(r.path, []).get(r.path)).push(r);
const live = new Map();
for (const f of ["live.tsv", "live-symlinks.tsv"]) {
  try { for (const ln of readFileSync(A + "/apps-judgment/" + f, "utf8").split("\n")) { const c = ln.split("\t"); if (c[0] && c.at(-1)) live.set(c[0], c.at(-1).trim()); } } catch {}
}
const entries = []; const realEntry = new Map();
for (const [p, rs] of byPath) {
  const top = Math.max(...rs.map((r) => ACT_RANK[r.a]));
  const strict = rs.filter((r) => ACT_RANK[r.a] === top);
  const action = strict[0].a;
  const category = strict.map((r) => r.c).sort((a, b) => CAT_RANK[b] - CAT_RANK[a])[0];
  const confidence = strict.map((r) => r.k).sort((a, b) => CONF_RANK[b] - CONF_RANK[a])[0];
  const mp = maskPath(p);
  const g = guard.get(p);
  const bySrc = {}; for (const r of rs) { const prev = bySrc[r.s]; if (!prev || ACT_RANK[r.a] > ACT_RANK[prev]) bySrc[r.s] = r.a; }
  const lines = [...new Set(rs.map((r) => (r.l ?? "").toString().trim()).filter(Boolean))].join("; ");
  const notes = [...new Set(rs.map((r) => r.n))].map((n) => maskText(n.length > 420 ? n.slice(0, 417) + "..." : n));
  const e = {
    path: mp.path,
    ...(mp.masked ? { path_masked: true, glob_matches: tracked.filter((t) => globRe(mp.path).test(t)).length } : {}),
    ...(lines ? { lines: maskText(lines) } : {}),
    category, categories: [...new Set(rs.map((r) => r.c))].sort((a, b) => CAT_RANK[b] - CAT_RANK[a]),
    action, confidence,
    sources: Object.keys(bySrc).sort(),
    ...(new Set(Object.values(bySrc)).size > 1 ? { actions_by_source: bySrc } : {}),
    ...(g ? { guard: { unapproved: g.unapproved, approved: g.approved, rules: g.rules } } : { guard: { unapproved: 0, approved: 0 } }),
    ...(glByPath.has(p) ? { gitleaks: glByPath.get(p) } : {}),
    ...(symlinks.has(p) ? { symlink: true } : {}),
    ...(live.has(p) ? { live_docs_site: live.get(p) } : {}),
    note: notes.join(" || "),
  };
  entries.push(e); realEntry.set(p, e);
}
// symlinks inherit the strictest action of their in-repo target (consistency: a link must not re-expose a doc kept private)
let inherited = 0;
for (const p of symlinks) {
  let tgt; try { tgt = readlinkSync(SRC + "/" + p); } catch { continue; }
  if (tgt.startsWith("/")) continue;
  const real = posix.normalize(posix.join(posix.dirname(p), tgt));
  const te = realEntry.get(real); if (!te) continue;
  let e = realEntry.get(p);
  if (!e) { const mp = maskPath(p); e = { path: mp.path, ...(mp.masked ? { path_masked: true } : {}), category: te.category, categories: [te.category], action: "publish_ok_after_review", confidence: te.confidence, sources: [], guard: { unapproved: 0, approved: 0 }, symlink: true, note: "" }; entries.push(e); realEntry.set(p, e); }
  e.symlink_target = maskPath(real).path;
  if (ACT_RANK[te.action] > ACT_RANK[e.action]) {
    e.action = te.action; e.category = te.category; e.confidence = te.confidence;
    e.categories = [...new Set([...e.categories, ...te.categories])];
    e.sources = [...new Set([...e.sources, "synthesis:symlink-inherit"])].sort();
    e.note = (e.note ? e.note + " || " : "") + "Symlink to " + e.symlink_target + "; action inherited from the target so the link cannot re-expose or dangle on a withheld doc.";
    if (live.has(p)) e.live_docs_site = live.get(p);
    inherited++;
  }
}
console.log("symlink entries upgraded/added:", inherited);
// guard findings with no row at all (should be none)
const noRow = [...guard.keys()].filter((p) => !byPath.has(p));
entries.sort((a, b) => ACT_RANK[b.action] - ACT_RANK[a.action] || CAT_RANK[b.category] - CAT_RANK[a.category] || a.path.localeCompare(b.path));

// ---- areas ----
const areaOf = (p) => {
  const s = p.split("/");
  if (s.length === 1) return "(root)";
  if (["api", "apps", "docs", "review", "tests", "infra"].includes(s[0]) && s.length > 2) return s[0] + "/" + s[1];
  if (s[0] === "packages" && s.length > 2) return "packages/" + s[1];
  if (s[0] === "bin" && s.length > 2 && ["tests", "gospel-release", "vendor"].includes(s[1])) return "bin/" + s[1];
  return s[0];
};
const realByMasked = new Map(); for (const [p] of realEntry) realByMasked.set(maskPath(p).path, p);
const areas = {};
for (const p of tracked) { const a = areaOf(p); (areas[a] ??= { files: 0, flagged: 0, blocking: 0, by_action: {}, by_category: {} }).files++; }
for (const e of entries) {
  const real = realByMasked.get(e.path); const a = areas[areaOf(real)];
  a.flagged++; if (e.action !== "publish_ok_after_review") a.blocking++;
  a.by_action[e.action] = (a.by_action[e.action] ?? 0) + 1; a.by_category[e.category] = (a.by_category[e.category] ?? 0) + 1;
}
const counts = { by_action: {}, by_category: {}, by_category_action: {}, by_source: {} };
for (const e of entries) {
  counts.by_action[e.action] = (counts.by_action[e.action] ?? 0) + 1;
  counts.by_category[e.category] = (counts.by_category[e.category] ?? 0) + 1;
  const k = e.category + "/" + e.action; counts.by_category_action[k] = (counts.by_category_action[k] ?? 0) + 1;
  for (const s of e.sources) counts.by_source[s] = (counts.by_source[s] ?? 0) + 1;
}
const anyCat = {}; for (const e of entries) for (const c of e.categories) anyCat[c] = (anyCat[c] ?? 0) + 1;
counts.files_touching_category = anyCat;

writeFileSync(A + "/synth-work/build-out.json", JSON.stringify({ entries, areaFlags, areas, counts, unresolved, noRow: noRow.map((p) => maskPath(p).path), tracked: tracked.length, symlinks: symlinks.size }, null, 1));
console.log("entries", entries.length, "areaFlags", areaFlags.length, "unresolved", unresolved.length, unresolved.slice(0, 40));
console.log("noRow", noRow.length, noRow.slice(0, 10).map((p) => maskPath(p).path));
console.log(JSON.stringify(counts, null, 1));
console.log("gitleaks paths", glByPath.size, "symlinks", symlinks.size);
