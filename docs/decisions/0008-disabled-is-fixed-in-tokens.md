# 0008. The disabled color is fixed in tokens, shared by the recipes

- Status: Accepted
- Date: 2026-10-18
- Package: adaptive-ui

It is implemented in `src/reference/color.ts` (`DisabledTokens`, the deltas of the recipes, and `createColorSets`) and in
`blackOrWhiteByContrastSet` of `src/core/color/recipes/`. The number 0007 is the proposed record of the recipes on `token-library/recipes-prototype`, which
isn't for merging, so this one doesn't take it.

## Context

A color set has a color for each of five states, and the disabled one was not like the others. Each of the 11 recipes had a disabled delta of
its own (3 for the fills, 8 for the strokes, and 0 for the ones that are transparent at rest) and the palette of the disabled color was the neutral palette
without a reason that was written down. A system that wants its disabled controls to look different had to change 11 numbers and a palette.

## Decision

- **The disabled values are tokens in a group, `color.disabled`,** next to the disabled palette: `fillDelta` (3) and `strokeDelta` (8).
  The disabled delta of each recipe is the alias of the one for its kind, until it is set, so a recipe is given a number and doesn't choose one. A recipe that has no color at
  rest (stealth, safety) has a disabled delta of `0`, which is transparent, as it was.
- **The disabled palette is the palette of the layers** until it is set. A disabled color is a color that blends into the background, and the layer is the background, so it follows
  a system that has its own layer palette. With the default palettes it is the neutral palette, as before.
- **The focus delta of a recipe is its rest** until it is set, which is what it was for all of them.
- **A set is made by `createColorSets({ palette })`,** the config of the sets of a palette to spread into its group. It doesn't find where it is, it reads the palette that it is given and the tokens that
  are always at one place.

## Consequences

- One number changes the disabled colors of every recipe, and a system that sets its own recipe's disabled delta changes only that.
- The group of the deltas of a recipe needs to say where it is for the focus to be its rest, since a token can't refer to the one next to it. It is the one pointer for each group, typed, in `color.ts`.
  The library could give an alias the group that it is in (second argument), which would remove it.
- The sets of a palette are the same recipes for every palette, so a change to the recipe is one change, and the value that a set has with a palette that is not neutral is still the legacy one.

## Alternatives

- **A disabled delta for each recipe, as it was.** It is more control that nothing used, and it is the 11 numbers.
- **The disabled palette stays the neutral palette.** It would not follow a layer with its own palette. The layer is the background that a disabled color blends into.
