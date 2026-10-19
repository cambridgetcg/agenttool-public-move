#!/bin/bash
# Synthesis rehearsal: allowlist export into a fresh public clone (no fetch from
# private) -> non-vacuous subset check -> adoption merge -> merge-back cycles
# computed with `git merge-base` -> widening export -> drift / collision / rename
# -> leak guards (pushurl, R pre-push, R pre-commit, P pre-push). Synthetic
# content only, local bare repos only, no network.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; W="$HERE/work"; rm -rf "$W"; mkdir -p "$W"; cd "$W"
export GIT_CONFIG_GLOBAL=/dev/null GIT_CONFIG_NOSYSTEM=1
unset GIT_AUTHOR_NAME GIT_AUTHOR_EMAIL GIT_COMMITTER_NAME GIT_COMMITTER_EMAIL
g(){ git -c init.defaultBranch=main -c advice.detachedHead=false "$@"; }
N=0; F=0; pass(){ N=$((N+1)); echo "PASS $N: $*"; }; fail(){ F=$((F+1)); echo "FAIL: $*"; }
PUBID='-c user.name=AgentTool -c user.email=contact@public.invalid'
EMAILRE='^(contact@public\.invalid|[0-9]+\+[A-Za-z0-9-]+@users\.noreply\.github\.com|noreply@github\.com)$'

# ---------- R: private repo with history ----------
g init -q --bare rorigin.git
g clone -q rorigin.git rdev 2>/dev/null; cd rdev; g config user.name dev; g config user.email dev@private.invalid
mkdir -p packages/pkg docs api .github/workflows private/guard
echo "token=OLD-CRED-123" > ops.env
printf 'a1\na2\na3\n' > packages/pkg/a.txt; echo b > packages/pkg/b.txt; printf '#!/bin/sh\necho hi\n' > packages/pkg/run.sh; chmod +x packages/pkg/run.sh
echo "private readme" > README.md; echo "CANARYTERM private doc" > docs/rel.md; echo "api v1" > api/x.ts
echo "private ci" > .github/workflows/ci.yml; echo "CANARYTERM" > private/guard/denylist.txt
head -c 32 /dev/urandom > private/CANARY
g add -A && g commit -qm "private root" && g push -q origin main; RROOT=$(g rev-parse HEAD)
g rm -q ops.env && g commit -qm "remove cred (still in history)" && g push -q origin main
# stage-0 root adoption: shared root files take the public text, private text moves under private/
g mv README.md private/root-README.md; echo "public readme" > README.md
g mv .github/workflows/ci.yml .github/workflows/private-ci.yml
printf "jobs:\n  x:\n    if: github.repository == 'org/public'\n" > .github/workflows/ci.yml
g add -A && g commit -qm "stage 0: adopt public root files" && g push -q origin main
X=$(g rev-parse HEAD); DENY="$W/rdev/private/guard/denylist.txt"; CANARY_BLOB=$(g rev-parse HEAD:private/CANARY)
cd "$W"

# ---------- export: blobs from R written into a P clone; P never fetches R ----------
export_paths(){ # R-dir R-commit P-dir paths...
  local R=$1 C=$2 P=$3; shift 3; local paths=("$@"); : > "$W/exp.txt"
  for p in "${paths[@]}"; do g -C "$R" ls-tree -r "$C" -- "$p" >> "$W/exp.txt"; done
  awk '{print $1}' "$W/exp.txt" | grep -qE '^(120000|160000)$' && { echo "export: symlink/submodule refused"; return 1; }
  cut -f2 "$W/exp.txt" | grep -qE '^(private/|\.github/workflows/private-)' && { echo "export: private namespace refused"; return 1; }
  while IFS=$'\t' read -r meta path; do
    read -r mode _t oid <<< "$meta"
    mkdir -p "$P/$(dirname "$path")"; g -C "$R" cat-file blob "$oid" > "$P/$path"
    if [ "$mode" = 100755 ]; then chmod +x "$P/$path"; else chmod -x "$P/$path"; fi
    if grep -qiF -f "$DENY" "$P/$path"; then echo "export: relational hit in exported blob (path withheld)"; return 1; fi
    [ "$oid" = "$CANARY_BLOB" ] && { echo "export: canary"; return 1; }
  done < "$W/exp.txt"
  ( cd "$P" && g add -A -- "${paths[@]}" )
  # byte-identity proof: index entries == R tree entries for the exported scope
  ( cd "$P" && g ls-files -s -- "${paths[@]}" | awk '{split($0,t,"\t"); split(t[1],m," "); print m[1]" "m[2]"\t"t[2]}' | sort ) > "$W/got.txt"
  awk '{split($0,t,"\t"); split(t[1],m," "); print m[1]" "m[3]"\t"t[2]}' "$W/exp.txt" | sort > "$W/want.txt"
  cmp -s "$W/got.txt" "$W/want.txt" || { echo "export: identity mismatch"; return 1; }
}

# ---------- P0: fresh public clone, exported, pushed to the "GitHub" bare repo ----------
g init -q --bare pub.git; g init -q pclone; cd pclone
g config user.name AgentTool; g config user.email contact@public.invalid
cd "$W"
STAGE1="packages README.md .github/workflows/ci.yml"
if export_paths rdev "$X" pclone $STAGE1; then pass "stage-1 export: byte identity of exported scope proven (modes incl. 100755)"; else fail "export"; fi
( cd pclone && g commit -qm "AgentTool public root" -m "Exported-From: $X" && g remote add origin "$W/pub.git" && g push -q origin main )
P0=$(g -C pclone rev-parse HEAD)
# negative: export refuses private namespace and a denylisted blob
mkdir -p "$W/tmpP" && ( cd "$W/tmpP" && g init -q )
export_paths rdev "$X" "$W/tmpP" private/CANARY >/dev/null && fail "exported private/" || pass "export refuses private/ namespace"
export_paths rdev "$X" "$W/tmpP" docs >/dev/null && fail "exported relational blob" || pass "export refuses a blob that hits the denylist"
# "private window" server check: fresh clone of what the server holds
g clone -q pub.git verify && { cd verify
  [ "$(g rev-list --all | wc -l | tr -d ' ')" = 1 ] && pass "server holds exactly 1 commit" || fail "commit count"
  g cat-file -e "$RROOT" 2>/dev/null && fail "private root object on server" || pass "no private commit object on server"
  g log --all -p | grep -q OLD-CRED && fail "old cred reachable" || pass "old credential unreachable on server"
  g log --format='%ae %ce' | grep -Evq 'contact@public.invalid contact@public.invalid' && fail "identity" || pass "P0 author+committer = public identity"; cd "$W"; }

# ---------- merge clone: the only R checkout with a public remote ----------
g clone -q rorigin.git mclone 2>/dev/null; cd mclone; g config user.name dev; g config user.email dev@private.invalid
g remote add public "$W/pub.git"; g remote set-url --push public file:///dev/null/public-is-fetch-only; g config remote.public.tagOpt --no-tags
g fetch -q public
# non-vacuous subset check (judge fix): every P0 path exists in R with the same blob
[ -z "$(g diff --no-renames --name-only --diff-filter=DMT "$P0" origin/main)" ] && pass "subset check: P0 is a byte-identical subset of R main" || fail subset
# negative control: a P0 whose README differs must fail the subset check
BADT=$(printf '100644 blob %s\tREADME.md\n' "$(echo different | g hash-object -w --stdin)" | g mktree); BAD=$(echo bad | g commit-tree "$BADT")
[ -n "$(g diff --no-renames --name-only --diff-filter=DMT "$BAD" origin/main)" ] && pass "subset check is not vacuous (detects a differing root file)" || fail "vacuous subset check"
g switch -q -c adopt origin/main
g merge -q --allow-unrelated-histories -s ours -m "Adopt public root ${P0:0:12}" public/main
[ "$(g rev-parse HEAD^{tree})" = "$(g rev-parse origin/main^{tree})" ] && pass "adoption merge keeps the R tree" || fail adopt
g push -q origin HEAD:main && g push -q origin "$P0:refs/heads/public-sync"
[ "$(g merge-base HEAD public/main)" = "$P0" ] && pass "merge-base(R main, P main) = P0" || fail mb
g merge-base --is-ancestor "$RROOT" HEAD && pass "old R root still an ancestor (projection lane ancestry intact)" || fail anc
g push -q public HEAD:refs/heads/leak 2>/dev/null && fail "merge clone pushed to public" || pass "merge clone cannot push to public (pushurl file:///dev/null)"
cd "$W"

# ---------- merge-back function (the exact cycle) ----------
merge_back(){
  cd "$W/mclone" || return 9
  g fetch -q origin main; g fetch -q origin public-sync; g fetch -q public main
  PUB=$(g rev-parse public/main); BASE=$(g merge-base origin/main "$PUB")
  [ "$(g rev-list --max-parents=0 "$PUB")" = "$P0" ] || { echo "public has a foreign root"; return 2; }
  g merge-base --is-ancestor "$BASE" "$PUB" || { echo "public main rewound"; return 2; }
  [ "$BASE" = "$PUB" ] && { echo "up to date"; return 0; }
  if { g log --format=%B "$BASE..$PUB"; g log -p --format= "$BASE..$PUB" | grep '^+'; } | grep -qiF -f "$DENY"; then echo "incoming scan hit"; return 3; fi
  real=""; for f in $(g diff --no-renames --name-only --diff-filter=DMT "$BASE" origin/main); do
    [ "$(g rev-parse -q --verify "origin/main:$f")" = "$(g rev-parse -q --verify "$PUB:$f")" ] || real="$real $f"; done
  [ -z "$real" ] || { echo "drift:$real"; return 4; }
  g switch -q -C merge-back origin/main
  g merge -q --no-ff -m "Merge public main ${PUB:0:12}" "$PUB" >/dev/null 2>&1 || { g merge --abort; echo "conflict"; return 5; }
  [ -z "$(g diff --no-renames --name-only --diff-filter=DMT "$PUB" HEAD)" ] || { echo "identity broken"; return 6; }
  g push -q origin HEAD:main && g push -q origin "$PUB:refs/heads/public-sync"
  LASTBASE=$BASE; echo "merged base=${BASE:0:8} pub=${PUB:0:8}"
}

# ---------- public development clone with hooks ----------
g clone -q pub.git pdev; cd pdev
g config user.name AgentTool; g config user.email contact@public.invalid
g config publicguard.root "$P0"; g config publicguard.denylist "$DENY"; g config publicguard.canaries "$CANARY_BLOB"; g config publicguard.emailPattern "$EMAILRE"
cp "$HERE/pre-push-public.sh" .git/hooks/pre-push; chmod +x .git/hooks/pre-push
printf 'a1\na2-public-edit\na3\n' > packages/pkg/a.txt; echo c > packages/pkg/c.txt; g rm -q packages/pkg/b.txt
g switch -q -c feature && g add -A && g commit -qm "edit a, add c, drop b" && g switch -q main && g merge -q --no-ff -m "Merge PR #1" feature
g push -q origin main && pass "clean public push (PR-style merge commit) accepted by hook" || fail "clean push"
cd "$W/rdev"; g pull -q; mkdir -p private/notes; echo "more private" > private/notes/n.md; echo "api v2 (R-only area)" > api/x.ts; g add -A; g commit -qm "private work"; g push -q origin main; cd "$W"
out=$(merge_back); echo "  $out"
case "$out" in *"merged base=${P0:0:8}"*) pass "merge-back 1: base = P0 via git merge-base (no message grep)";; *) fail "merge-back 1: $out";; esac
cd "$W/mclone"
[ -f private/notes/n.md ] && [ ! -f packages/pkg/b.txt ] && [ -f packages/pkg/c.txt ] && grep -q v2 api/x.ts && pass "private-only + R-only kept; public add/delete applied" || fail content
g merge-base --is-ancestor public/main origin/main && pass "public tip is an ancestor of R main (provenance)" || fail prov
cd "$W"; out=$(merge_back); [ "$out" = "up to date" ] && pass "re-run with nothing new is a no-op" || fail "rerun: $out"

# ---------- widening export: an R-only area becomes shared ----------
cd "$W/rdev"; g pull -q; mkdir -p specs; echo "spec v1" > specs/s.md; g add -A; g commit -qm "spec (R-only so far)"; g push -q origin main; XW=$(g rev-parse HEAD); cd "$W"
cd pdev; g pull -q; g switch -q -c widen-specs; cd "$W"
export_paths rdev "$XW" pdev specs && ( cd pdev && g commit -qm "widen: specs" -m "Exported-From: $XW" && g switch -q main && g merge -q --no-ff -m "Merge PR #2" widen-specs && g push -q origin main ) && pass "widening export committed in P (parent = public main)" || fail widen
out=$(merge_back); case "$out" in merged*) pass "widening merges back clean (identical add/add)";; *) fail "widen merge: $out";; esac

# ---------- dir rename in P: clean when R keeps nothing private inside shared dirs ----------
cd pdev; g pull -q; g mv packages/pkg packages/pkg-renamed; g commit -qm "rename dir"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in merged*) pass "public dir rename merges clean (private files live under private/)";; *) fail "rename: $out";; esac

# ---------- R checkout guards (no public remote needed) ----------
cd "$W/rdev"; g pull -q
cat > .git/hooks/pre-commit <<'H'
#!/bin/bash
git fetch -q origin public-sync 2>/dev/null || true
shared=$(git ls-tree -r --name-only refs/remotes/origin/public-sync 2>/dev/null)
for f in $(git diff --cached --name-only --diff-filter=DMT); do
  if printf '%s\n' "$shared" | grep -qxF -- "$f" && [ -z "${ALLOW_SHARED_EDIT:-}" ]; then echo "pre-commit: $f is shared; change it in the public repo" >&2; exit 1; fi
done
H
cat > .git/hooks/pre-push <<'H'
#!/bin/bash
case "$2" in *pub.git*|*org/public*) echo "pre-push: the public repo is never a push target from a private checkout" >&2; exit 1;; esac
H
chmod +x .git/hooks/pre-commit .git/hooks/pre-push
printf 'a1\nPRIVATE\na3\n' > packages/pkg-renamed/a.txt; g add -A
g commit -qm "edit shared" 2>/dev/null && fail "pre-commit let a shared edit through" || pass "R pre-commit refuses edits to shared paths (via origin/public-sync)"
g push -q "$W/pub.git" HEAD:refs/heads/x 2>/dev/null && fail "R pushed to public by URL" || pass "R pre-push refuses an explicit public URL"
# drift that bypassed the hook is still caught before merging
ALLOW_SHARED_EDIT=1 g commit -qm "edit shared (bypassed)"; g push -q origin main; cd "$W"
cd pdev; g pull -q; echo d > packages/pkg-renamed/d.txt; g add -A; g commit -qm "public add d"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in drift*) pass "merge-back refuses to run while R drifted on a shared path";; *) fail "drift: $out";; esac
cd rdev; g revert --no-edit HEAD >/dev/null; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in merged*) pass "after reverting the drift, merge-back is clean";; *) fail "post-drift: $out";; esac

# ---------- collision: P adds a path that R holds R-only with other bytes ----------
cd pdev; g pull -q; echo "public api" > api/x.ts 2>/dev/null || { mkdir -p api; echo "public api" > api/x.ts; }; g add -A; g commit -qm "public adds api/x.ts"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in conflict*) pass "add/add collision stops the merge (fail closed, nothing pushed)";; *) fail "collision: $out";; esac
cd rdev; g pull -q; mkdir -p private/api; g mv api/x.ts private/api/x.ts; g commit -qm "relocate R-only file under private/"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in merged*) pass "after relocating into private/, merge is clean";; *) fail "post-collision: $out";; esac

# ---------- scattered private file inside a shared dir + public dir rename (why relocation precedes widening) ----------
cd rdev; g pull -q; echo "scattered private" > specs/private-note.md; g add -A; g commit -qm "scattered"; g push -q origin main; cd "$W"
cd pdev; g pull -q; g mv specs specifications; g commit -qm "rename specs"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in conflict*) pass "scattered R-only file in a shared dir + public rename => conflict (so: relocate first)";; *) echo "  note: $out (git may place it silently)"; fi_=1;; esac
cd rdev; g pull -q; g mv specs/private-note.md private/private-note.md; g commit -qm "relocate"; g push -q origin main; cd "$W"
out=$(merge_back); case "$out" in merged*) pass "relocated => rename merges clean";; *) fail "post-scatter: $out";; esac

# ---------- P pre-push refusals ----------
cd pdev; g pull -q
echo "x CANARYTERM" > leak.txt; g add -A; g commit -qm "leak"
g push -q origin HEAD:refs/heads/l1 2>/dev/null && fail "term in diff passed" || pass "P hook refuses a denylist term in added lines"
g reset -q --hard HEAD~1; echo ok > ok.txt; g add -A; g commit -qm "note: CANARYTERM in message only"
g push -q origin HEAD:refs/heads/l2 2>/dev/null && fail "term in message passed" || pass "P hook refuses a denylist term in a commit message"
g reset -q --hard HEAD~1; echo ok2 > ok2.txt; g add -A; g commit -qm "fine"
g push -q origin HEAD:refs/heads/canaryterm-branch 2>/dev/null && fail "term in ref passed" || pass "P hook refuses a denylist term in a ref name"
g -c user.email=dev@private.invalid commit -q --amend --no-edit --reset-author
g push -q origin HEAD:refs/heads/l3 2>/dev/null && fail "private email passed" || pass "P hook refuses a non-allowlisted author email"
g reset -q --hard origin/main; cp "$W/rdev/private/CANARY" ./CANARY; g add -A; g commit -qm "copied file"
g push -q origin HEAD:refs/heads/l4 2>/dev/null && fail "canary passed" || pass "P hook refuses a private canary blob"
g reset -q --hard origin/main; cp "$DENY" ./words.txt; g add -A; g commit -qm "copied list"
g push -q origin HEAD:refs/heads/l5 2>/dev/null && fail "denylist bytes passed" || pass "P hook refuses the denylist bytes"
g reset -q --hard origin/main; g fetch -q "$W/rorigin.git" main:refs/tmp/priv
g push -q origin refs/tmp/priv:refs/heads/l6 2>/dev/null && fail "private history passed" || pass "P hook refuses R history (foreign root)"
g update-ref -d refs/tmp/priv
g config publicguard.denylist "$W/missing.txt"; echo z > z.txt; g add -A; g commit -qm z
g push -q origin HEAD:refs/heads/l7 2>/dev/null && fail "pushed without denylist" || pass "P hook fails closed without the denylist"
g config publicguard.denylist "$DENY"; g push -q origin HEAD:refs/heads/ok && pass "a clean branch push still passes" || fail "clean branch"
cd "$W"
[ "$(git -C pub.git rev-list --all --max-parents=0 | sort -u)" = "$P0" ] && pass "public repo still has a single root after all tests" || fail "roots"
echo "DONE: $N passed, $F failed"
