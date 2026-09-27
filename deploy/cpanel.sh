#!/usr/bin/env bash
# Builds the app and pushes dist/ to the `cpanel-deploy` branch, which cPanel
# (Git Version Control -> Update from Remote -> Deploy HEAD Commit) pulls and copies into place.
set -euo pipefail

BRANCH=cpanel-deploy
ROOT="$(git rev-parse --show-toplevel)"
WORKTREE="$ROOT/.deploy-worktree"
cd "$ROOT"

npm run build

git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
git worktree prune
if git fetch origin "$BRANCH" 2>/dev/null; then
  git worktree add -B "$BRANCH" "$WORKTREE" "origin/$BRANCH"
else
  git worktree add --detach "$WORKTREE"
  git -C "$WORKTREE" checkout --orphan "$BRANCH"
fi

find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
cp -R dist/. "$WORKTREE/"
cp deploy/.cpanel.yml "$WORKTREE/.cpanel.yml"

cd "$WORKTREE"
git add -A
git commit -q -m "build: $(git -C "$ROOT" rev-parse --short HEAD)" || echo "No changes to deploy"
git push origin "$BRANCH"

cd "$ROOT"
git worktree remove --force "$WORKTREE"
echo "Pushed $BRANCH. Now in cPanel: Git Version Control -> Manage -> Pull or Deploy -> Update from Remote -> Deploy HEAD Commit."
