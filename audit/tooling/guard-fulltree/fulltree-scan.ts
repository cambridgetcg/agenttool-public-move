#!/usr/bin/env bun
/**
 * Full-tree audit: applies the public guard's secret + personal content layers
 * and the private relational denylist layer to EVERY tracked blob of a commit,
 * plus the non-allowlist path rules. Prints rule ids, paths, lines and line
 * hashes only. Never prints matched text or denylist terms.
 *
 *   bun fulltree-scan.ts <repo> <out-dir>
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  blobKind,
  contentFindings,
  type Finding,
  gitText,
  parseGitleaksIgnore,
  parseGuardAllow,
  pathRuleFindings,
  PERSONAL_RULES,
  readTree,
  SECRET_RULES,
  sha256Hex,
} from "../guard/public/overlay/tools/public-guard.ts";
import { ALLOWLIST_PATH, DENYLIST_PATH, globToRegExp, parseAllowlist, parseDenylist } from "../guard/bin/project-public.ts";

const repo = process.argv[2];
const outDir = process.argv[3];
if (!repo || !outDir) throw new Error("usage: fulltree-scan.ts <repo> <out-dir>");

const head = gitText(repo, ["rev-parse", "--verify", "HEAD^{commit}"]).trim();
const { entries, files } = readTree(repo, head);

// Cross-check: the committed tree equals `git ls-files`.
const lsFiles = new Set(gitText(repo, ["ls-files", "-z"]).split("\0").filter(Boolean));
const treePaths = new Set(files.map((f) => f.path));
const onlyLs = [...lsFiles].filter((p) => !treePaths.has(p));
const onlyTree = [...treePaths].filter((p) => !lsFiles.has(p));

const OVERLAY = "public/overlay/";
const projected = (p: string) => (p.startsWith(OVERLAY) ? p.slice(OVERLAY.length) : p);

// Allowlist (to say whether a finding is already inside the current projection).
const allowlist = parseAllowlist(files.find((f) => f.path === ALLOWLIST_PATH)!.bytes);
const excludes = allowlist.exclude.map(globToRegExp);
function inProjection(p: string): "overlay" | "allowlisted" | "excluded-glob" | "outside" {
  if (p.startsWith(OVERLAY)) return "overlay";
  const included = allowlist.include.some((i) => (i.kind === "blob" ? p === i.path : p.startsWith(`${i.path}/`)));
  if (!included) return "outside";
  return excludes.some((re) => re.test(p)) ? "excluded-glob" : "allowlisted";
}

// Existing exception lists (projected path space).
const guardAllow = parseGuardAllow(files.find((f) => f.path === `${OVERLAY}tools/public-guard-allow.json`)!.bytes);
const guardAllowKeys = new Set(guardAllow.entries.map((e) => `${e.path}\0${e.rule}\0${e.line_sha256}`));
const binaryAllowKeys = new Set(guardAllow.binaries.map((b) => `${b.path}\0${b.sha256}`));
const gitleaksIgnore = parseGitleaksIgnore(files.find((f) => f.path === `${OVERLAY}.gitleaksignore`)!.bytes);

const denyBlob = files.find((f) => f.path === DENYLIST_PATH)!;
const deny = parseDenylist(denyBlob.bytes);
const relAllowKeys = new Set(deny.allow.map((e) => `${e.path}\0${e.rule}\0${e.line_sha256}`));

const regular = files.filter((f) => f.mode !== "120000");
const symlinks = files.filter((f) => f.mode === "120000");

type Out = Finding & { scope: string; allowedBy?: string; symlinkTarget?: boolean };
const out: Out[] = [];
const annotate = (f: Finding, extra: Partial<Out> = {}): Out => {
  const key = f.lineSha256 === undefined ? undefined : `${projected(f.path)}\0${f.rule}\0${f.lineSha256}`;
  let allowedBy: string | undefined;
  if (key !== undefined && f.layer === "relational" && relAllowKeys.has(key)) allowedBy = "relational-denylist-allow";
  if (key !== undefined && (f.layer === "secret" || f.layer === "personal") && guardAllowKeys.has(key)) allowedBy = "public-guard-allow";
  return { ...f, scope: inProjection(f.path), ...(allowedBy ? { allowedBy } : {}), ...extra };
};

// Path layer, minus allowlist membership.
for (const f of pathRuleFindings(entries, () => true)) out.push(annotate(f));

// Content layers over regular blobs (binary blobs via printable strings, as the guard does).
for (const f of contentFindings(regular, SECRET_RULES)) out.push(annotate(f));
for (const f of contentFindings(regular, PERSONAL_RULES)) out.push(annotate(f));
for (const f of contentFindings(regular, deny.rules)) out.push(annotate(f));
// Symlink targets: the guard skips them; scan them here as an extra.
for (const f of contentFindings(symlinks, [...SECRET_RULES, ...PERSONAL_RULES, ...deny.rules])) out.push(annotate(f, { symlinkTarget: true }));

// Relational blob digests and denylist copies.
const deniedDigests = new Map(deny.blobs.map((b) => [b.sha256, `relational/${b.id}`]));
const binaries: Array<{ path: string; kind: string; size: number; sha256: string; allowedBinary: boolean; scope: string }> = [];
for (const f of files) {
  const digest = sha256Hex(f.bytes);
  const rule = deniedDigests.get(digest);
  if (rule !== undefined) out.push(annotate({ layer: "relational", rule, path: f.path }));
  if (f.oid === denyBlob.oid || digest === deny.sha256) out.push(annotate({ layer: "relational", rule: "relational/denylist-copy", path: f.path }));
  if (f.mode !== "120000") {
    const kind = blobKind(f.bytes);
    if (kind !== "text") {
      binaries.push({ path: f.path, kind, size: f.bytes.length, sha256: digest, allowedBinary: binaryAllowKeys.has(`${projected(f.path)}\0${digest}`), scope: inProjection(f.path) });
    }
  }
}

writeFileSync(join(outDir, "fulltree-findings.json"), `${JSON.stringify(out, null, 1)}\n`);
writeFileSync(join(outDir, "fulltree-binaries.json"), `${JSON.stringify(binaries, null, 1)}\n`);
writeFileSync(
  join(outDir, "gitleaksignore-fingerprints.json"),
  `${JSON.stringify(gitleaksIgnore, null, 1)}\n`,
);

// Summary (ids and counts only).
const by = (key: (f: Out) => string, list: Out[] = out) => {
  const m = new Map<string, number>();
  for (const f of list) m.set(key(f), (m.get(key(f)) ?? 0) + 1);
  return [...m].sort((a, b) => b[1] - a[1]);
};
const summary = {
  head,
  trackedFiles: files.length,
  regular: regular.length,
  symlinks: symlinks.length,
  lsFilesMismatch: { onlyLs: onlyLs.length, onlyTree: onlyTree.length },
  denylist: { rules: deny.rules.length, blobDigests: deny.blobs.length, allowEntries: deny.allow.length },
  guardAllow: { entries: guardAllow.entries.length, binaries: guardAllow.binaries.length },
  gitleaksIgnoreFingerprints: gitleaksIgnore.length,
  total: out.length,
  byLayer: by((f) => f.layer),
  byRule: by((f) => f.rule),
  byScope: by((f) => `${f.layer}:${f.scope}`),
  allowedBy: by((f) => `${f.layer}:${f.allowedBy ?? "none"}`),
  binaries: binaries.length,
};
console.log(JSON.stringify(summary, null, 1));
