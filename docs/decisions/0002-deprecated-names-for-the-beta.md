# 0002. The 1.0 beta keeps deprecated names in one file, with a ledger

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

## Context

0.14 removed what was deprecated, after 0.13 warned about it. The 1.0 beta changes the token model, so it can't be a drop-in
replacement: about 60 exports of the core entry point are removed or replaced, and the `reference` entry point (about 450 exports) is
FAST tokens that have no equivalent object. Still, where only a name changed, or a call can be adapted, making a consumer find it is a cost
for nothing.

## Decision

- A **rename** is the new name under the old one. A call with the **old shape** (positional arguments) is an adapter that calls the new function.
  The static members of what was a class (`Color.parse`, `PaletteOkhsl.from`, `new LinearGradient(...)`) are functions of the plain data.
- A function that kept its **name** and changed its signature (`hueShiftGradient`, `invertingPaletteDeltasForSet`) is not overloaded for the old
  call. It's a break, without guidance.
- What was an **instance member**, and the types that belonged to the tokens, have no shim, and are in
  [MIGRATION.md](../../packages/adaptive-ui/MIGRATION.md) with what to use.
- It is all in `deprecated.ts` of its area, as its own commit at the end of the step, so the commits of the step read as the change.
  It is removed before 1.0.
- The deprecated names of the tokens (`export const x = tokens.a.b.c` against a default library) are added with each system of `reference`
  that is migrated. They need a default library, which isn't decided.
- The beta is **not** a drop-in replacement, and its changeset must say that.

## Consequences

- A name that is a type and a deprecated value (`Color`, `LinearGradient`) can't be exported by two modules with `export *`, so the index names
  what it exports from the module with the type, until `deprecated.ts` is removed and it is `export *` again.
- The API report has both names while they exist.
- The ledger has to be extended in each step, and checked against the difference in the API report with 0.14.

## Alternatives

- **No shims**, like 0.14. The beta would be a harder step for everyone who adopts it early, for names that only changed.
- **A shim in each module**, next to the new name. It's harder to review as the step, and harder to remove.
- **Overloads for the functions that kept their names.** Tried, and removed: the old forms are clutter in the recipes, and it's a simple change to
  make.
