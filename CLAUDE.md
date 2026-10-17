# Adaptive Web Components

This repository is a monorepo. Right now the work is the 1.0 beta of `@adaptive-web/adaptive-ui`, which moves from the FAST design
tokens to the [design token library](https://github.com/nicholasrice/design-token-library) (a sibling checkout at `../design-token-library`,
and `nicholasrice/design-token-library` on GitHub, which we contribute to).

## Where things are written down

- `docs/decisions/` has the decisions and why, as numbered records. Read the ones that touch what you are changing, and add one for a decision that
  a reader of the code would ask about. `docs/decisions/README.md` says when.
- `packages/adaptive-ui/MIGRATION.md` is the ledger of what changed since 0.14 and what to use instead. Extend it with each step.
- The plan is `~/.claude/plans/scalable-stirring-stardust.md` (not in the repo).

## Working on the migration

- Only `@adaptive-web/adaptive-ui` is built, tested, and published right now. Run `npm run build`, `npm test`, and `npm run lint` in `packages/adaptive-ui`.
- `npm install` fails until the library is published (the dependency isn't on npm yet). The library is used from a link in the root
  `node_modules`. Don't run `npm install` and don't change that link.
- Branches: each step is a branch off the one before it, `token-library/<step>`, the first off `main`, and a pull request targets the branch it
  builds on (a stack, see CONTRIBUTING.md). `docs/decisions/0003-migrate-behind-an-exclusion-frontier.md` explains how what isn't migrated is excluded in
  `tsconfig.json` and `.eslintrc.json`.
- Commits are logical and contained, and the history is kept clean: a fix goes into the commit it belongs to, and cancelling commits are removed.
  After you change an earlier commit, run `scripts/check-each-commit.sh <base>` so the generated API report of each commit is right, then restack
  the branches on top.
- The deprecated names of a step are the last commit of the step (see decision 0002).
- Don't push, open a pull request, or publish unless asked. "Hold the PR" means push the branch only.

## Conventions

- Token values are plain data (a DTCG color, not a class), and behavior is a function. A custom token type is treated the same as a standard one.
- Prefer types that can't be wrong over a cast or a string. Reuse what the library does (naming, conversion) and don't copy it.
- A gap in the library is an issue and a pull request there, with a reproduction and a test that fails without the fix.
