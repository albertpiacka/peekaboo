#!/usr/bin/env bash
set -euo pipefail

# Usage: ./scripts/release.sh [patch|minor|major]
# Default: patch

BUMP="${1:-patch}"

if [[ "$BUMP" != "patch" && "$BUMP" != "minor" && "$BUMP" != "major" ]]; then
  echo "Usage: pnpm release [patch|minor|major]"
  exit 1
fi

# Ensure working tree is clean
if [[ -n "$(git status --porcelain)" ]]; then
  echo "Error: working tree is dirty. Commit or stash changes first."
  exit 1
fi

# Ensure we're on main
BRANCH="$(git branch --show-current)"
if [[ "$BRANCH" != "main" ]]; then
  echo "Error: releases must be made from main (currently on $BRANCH)"
  exit 1
fi

# Bump version in package.json (no git tag — we do it ourselves)
NEW_VERSION="$(npm version "$BUMP" --no-git-tag-version)"

echo "Releasing $NEW_VERSION"

git add package.json
git commit -m "release: $NEW_VERSION"
git tag "$NEW_VERSION"
git push origin main --tags

echo "Done — $NEW_VERSION pushed. GitHub Actions will publish to npm."
