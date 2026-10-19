#!/usr/bin/env bun
/**
 * Supplemental (non-guard) shapes over every tracked regular blob. Prints
 * path, line, rule id, and a masked shape descriptor only (length + whether the
 * value looks like a placeholder). Never prints matched text.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { readTree, scannableText } from "../guard/public/overlay/tools/public-guard.ts";

const [repo, outDir] = process.argv.slice(2) as [string, string];
const { files } = readTree(repo, "HEAD");
const RULES: Array<{ id: string; re: RegExp; group?: number }> = [
  { id: "supp/db-url-password", re: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|rediss?|amqps?):\/\/[^:/\s@'"`]+:([^@\s'"`]+)@/gu, group: 1 },
  { id: "supp/jwt", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/gu },
  { id: "supp/anthropic-key", re: /\bsk-ant-[A-Za-z0-9_-]{20,}/gu },
  { id: "supp/openai-key", re: /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}/gu },
  { id: "supp/hf-token", re: /\bhf_[A-Za-z0-9]{30,}/gu },
  { id: "supp/google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}/gu },
  { id: "supp/fly-token", re: /\bFlyV1 [A-Za-z0-9_,=+/-]{20,}|\bfo1_[A-Za-z0-9_-]{20,}/gu },
  { id: "supp/agenttool-bearer", re: /\bat_[A-Za-z0-9_-]{32,}/gu },
  { id: "supp/agenttool-mission-token", re: /\batcm_[A-Za-z0-9_-]{43}\b/gu },
  { id: "supp/agenttool-local-context", re: /\batlc_[A-Za-z0-9_-]{20,}/gu },
  { id: "supp/stripe-test-or-restricted", re: /\b(?:sk|rk|pk)_(?:test|live)_[A-Za-z0-9]{16,}/gu },
  { id: "supp/stripe-webhook-secret", re: /\bwhsec_[A-Za-z0-9]{20,}/gu },
  { id: "supp/cloudflare-token-assign", re: /(?:CLOUDFLARE|CF)_(?:API_)?(?:TOKEN|KEY)\s*[:=]\s*["']?[A-Za-z0-9_-]{30,}/gu },
  { id: "supp/hex-privkey-assign", re: /(?:priv(?:ate)?[_-]?key|secret[_-]?key|seed|mnemonic)["']?\s*[:=]\s*["']?(?:0x)?[0-9a-fA-F]{64}\b/giu },
  { id: "supp/basic-auth-url", re: /\bhttps?:\/\/[^:/\s@'"`]+:([^@\s'"`]{3,})@[A-Za-z0-9.-]+/gu, group: 1 },
  { id: "supp/ipv4-nonlocal", re: /\b(?!127\.|0\.0\.0\.0|255\.|10\.0\.0\.[01]\b)(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)\b/gu },
  { id: "supp/tailscale-host", re: /\b[a-z0-9-]+\.(?:tail[0-9a-f]+\.ts\.net)\b/gu },
  { id: "supp/phone-intl", re: /(?<![\w.])\+(?:44|852|86|1)[ -]?\(?\d{2,4}\)?[ -]?\d{3,4}[ -]?\d{3,4}\b/gu },
  { id: "supp/evm-address", re: /\b0x[0-9a-fA-F]{40}\b/gu },
];
const PLACEHOLDER = /^(?:x+|\*+|\.\.\.|secret|password|pass|pw|changeme|example|test|dummy|fake|placeholder|<[^>]+>|\$\{?[A-Z_]+\}?|REDACTED)$/iu;
const rows: Array<{ rule: string; path: string; line: number; len: number; placeholderLike: boolean }> = [];
for (const file of files) {
  if (file.mode === "120000") continue;
  const text = scannableText(file.bytes);
  let starts: number[] | undefined;
  for (const { id, re, group } of RULES) {
    re.lastIndex = 0;
    const seen = new Set<number>();
    for (let m = re.exec(text); m !== null; m = re.exec(text)) {
      if (!starts) {
        starts = [0];
        for (let i = text.indexOf("\n"); i >= 0; i = text.indexOf("\n", i + 1)) starts.push(i + 1);
      }
      let lo = 0;
      let hi = starts.length - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if ((starts[mid] as number) <= m.index) lo = mid;
        else hi = mid - 1;
      }
      if (seen.has(lo)) continue;
      seen.add(lo);
      const value = group ? (m[group] ?? "") : m[0];
      const fake = PLACEHOLDER.test(value) || /(?:fake|test|example|dummy|redacted|placeholder|NOT-A|xxxx|0000000000|1234567890|abcdef)/iu.test(value);
      rows.push({ rule: id, path: file.path, line: lo + 1, len: value.length, placeholderLike: fake });
    }
  }
}
writeFileSync(join(outDir, "supplemental-findings.json"), `${JSON.stringify(rows, null, 1)}\n`);
const count = new Map<string, number>();
for (const r of rows) count.set(`${r.rule} placeholderLike=${r.placeholderLike}`, (count.get(`${r.rule} placeholderLike=${r.placeholderLike}`) ?? 0) + 1);
for (const [k, v] of [...count].sort()) console.log(v, k);
