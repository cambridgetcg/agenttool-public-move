#!/usr/bin/env bun
/** Strips a gitleaks JSON report to rule/path/line/line-hash and marks existing .gitleaksignore coverage. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { decodeText, lineSha256, readTree } from "../guard/public/overlay/tools/public-guard.ts";

const [repo, report, outDir] = process.argv.slice(2) as [string, string, string];
const prefix = `${repo.replace(/\/$/u, "")}/`;
const { files } = readTree(repo, "HEAD");
const byPath = new Map(files.map((f) => [f.path, f]));
const fps = JSON.parse(readFileSync(join(outDir, "gitleaksignore-fingerprints.json"), "utf8")) as Array<{ path: string; rule: string; line: number; lineSha256: string }>;
const fpKeys = new Map(fps.map((f) => [`${f.path}:${f.rule}:${f.line}`, f.lineSha256]));
const OVERLAY = "public/overlay/";
const raw = JSON.parse(readFileSync(report, "utf8")) as Array<Record<string, unknown>>;
const rows = raw.map((leak) => {
  const path = String(leak.File).startsWith(prefix) ? String(leak.File).slice(prefix.length) : String(leak.File);
  const line = Number(leak.StartLine);
  const file = byPath.get(path);
  const text = file ? decodeText(file.bytes).split("\n")[line - 1] : undefined;
  const sha = text === undefined ? undefined : lineSha256(text);
  const projected = path.startsWith(OVERLAY) ? path.slice(OVERLAY.length) : path;
  const fp = fpKeys.get(`${projected}:${leak.RuleID}:${line}`);
  return {
    layer: "gitleaks",
    rule: `gitleaks/${leak.RuleID}`,
    path,
    line,
    endLine: Number(leak.EndLine),
    entropy: leak.Entropy,
    lineSha256: sha,
    ignoredBy: fp !== undefined && fp === sha ? "overlay/.gitleaksignore" : fp !== undefined ? "fingerprint-hash-mismatch" : undefined,
  };
});
writeFileSync(join(outDir, "gitleaks-findings-stripped.json"), `${JSON.stringify(rows, null, 1)}\n`);
for (const r of rows) console.log(`${r.path}:${r.line}${r.endLine !== r.line ? `-${r.endLine}` : ""} ${r.rule} ${r.ignoredBy ?? "-"} ${r.lineSha256?.slice(0, 12)}`);
