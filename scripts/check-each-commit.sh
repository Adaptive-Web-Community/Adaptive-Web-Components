#!/usr/bin/env bash
#
# Builds, tests, and lints each commit above a base, and brings the generated API report of each commit up to date.
#
#   scripts/check-each-commit.sh <base>     the commits of the current branch that are above <base>
#
# A commit whose API report changed is amended, so this rewrites the history of the branch. Use it on a branch that isn't
# shared, and restack the branches that are on it afterwards. The changes in the tree that aren't part of a commit are set
# aside and put back (`git rebase --autostash`). `PACKAGE` is the package to check, `packages/adaptive-ui` by default.
#
# A commit that doesn't build is reported, and doesn't stop it, since some steps have a commit that doesn't build on its own.

set -euo pipefail

package="${PACKAGE:-packages/adaptive-ui}"
strip_color() { sed 's/\x1b\[[0-9;]*m//g'; }

if [[ "${1:-}" == "--step" ]]; then
    cd "$(git rev-parse --show-toplevel)/$package"

    subject="$(git log -1 --format=%s | cut -c1-58)"

    if npm run build >/dev/null 2>&1; then build="ok"; else build="FAILED"; fi

    git add docs/api-report.api.md
    if git diff --cached --quiet; then report="report ok"; else
        git commit -q --amend --no-edit
        report="report updated"
    fi

    tests="$(npx mocha 2>&1 | strip_color | grep -E 'passing|failing' | xargs | sed 's/ (.*)//' || true)"
    lint="$(npx eslint . --ext .ts 2>&1 | strip_color | grep -E '✖' | xargs || true)"

    printf '%-58s | build %s | %s | %s | lint: %s\n' "$subject" "$build" "$report" "${tests:-no tests}" "${lint:-clean}"
    exit 0
fi

if [[ $# -ne 1 ]]; then
    sed -n '3,12p' "$0" | sed 's/^# \{0,1\}//'
    exit 2
fi

# The steps run from a copy, since the commits before the one that added this script don't have it.
step="$(mktemp)"
cp "$0" "$step"
chmod +x "$step"
git rebase --autostash --exec "$step --step" "$1"
