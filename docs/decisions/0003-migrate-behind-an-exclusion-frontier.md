# 0003. Migrate in steps, with what isn't migrated excluded from the build

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

## Context

Replacing the FAST tokens touches nearly everything: 31 files use `Color`, `Palette`, `Paint`, or a gradient. A build that is red until the end can't be
reviewed or tested. The values the tokens evaluate to are recorded in `src/reference/parity.snapshot.json`, from before the change.

## Decision

- Work in a stack of branches, one for each step, that builds on the last (`token-library/<step>`), each of which is reviewed as a unit. The
  first branch is based on `main`, and a pull request targets the branch that it builds on.
- What isn't migrated stays in the tree, **excluded** from `tsconfig.json`, from `.eslintrc.json`, and from the exports, with a comment that says
  to remove it from there when it is migrated. So each step builds, lints, and tests what is migrated, and the diff of the later step is an edit
  of the file that is there.
- The stored **parity snapshot** is the oracle, so the old code doesn't need to be kept next to the new. It is used again for each system as
  it is migrated, and in full at the end.
- Each commit should build where it can, and the history is kept clean: a fix is folded into the commit it belongs to. The API report is regenerated for
  each commit (`scripts/check-each-commit.sh`).

## Consequences

- The package exports less while the work goes on. The `./reference` export and the `aui` command point at output that isn't built until they
  are migrated, so nothing is published from this branch until then.
- The check of the generated CSS (`aui compile-styles`) is off until the styles are migrated.
- An excluded file can drift from the code it uses. It is rewritten when it is reached, which it needs anyway.
- The steps are a stack of branches, which has to be restacked when an earlier step changes.

## Alternatives

- **New modules next to the old ones**, with the old removed at the end. It doubles the code, loses the history of the files, and ends with
  a large deletion that can't be reviewed as a change.
- **In place with a red build**, until all is migrated. There's nothing to check on the way.
