# 0013. A value on a fill is made in the context of the fill, for the pairs the treatments have

- Status: Accepted
- Date: 2026-10-29
- Package: adaptive-ui
- Supersedes: the pairs of a fill and its foreground in [0012](0012-a-treatment-is-a-named-set-of-style-properties.md)

## Context

A treatment pairs a foreground with a background, and the foreground keeps its contrast with the background in each of its states. In
0.14 `Fill.backgroundAndForeground(fill, recipe)` made a FAST token for the pair when a style module was made: the recipe (the readable
stroke of a palette, black or white) was a token, and the pair was made on the spot, for whatever fill and recipe a module combined. The
pairs were never exported. Treatments are freeform: a new combination, a critical foreground on the accent fill, gets its pair because a
treatment has it.

Decision 0012 made the pairs tokens of the library, `color.<palette>.onFill.<fill>`. That is a fixed grid, each palette's foreground on its
own fills, put in the token model as if the pairs were tokens for regular use, and a combination the grid doesn't have needs a token of
its own. A pair is a consequence of how the tokens are used, not part of what they are.

With the token library, a value of a style is a `var()` of a custom property, and custom properties exist for the tokens of a library,
written for each scope: the root, and each layer, which is the library extended with its color as `color.context`. A fill depends on its
context, so a pair does too, and needs a custom property in each scope.

The recipes read their reference for its luminance only (`closestSwatchIndex`, `contrast`), so a fill is to what is on it what a layer
is to its content: a context.

## Decision

- A **value on a fill** (`OnFill`) is plain data in the properties of a treatment: a ref to a token that is relative to the color context,
  the fill it is on, and an option. `onFill(color.critical.stroke.readable, { fill: color.accent.fill.subtle })`.
- Without a `fill`, it is on the background fill of its rule (`resolveOnFills`), so a treatment of a foreground follows the fill of the
  treatment it is composed with. In a rule without a background fill it is the token itself, in the color context.
- Its value is the token **made in the context of each state of the fill** (`valueOnFill`): the library extended with the state of the fill
  as the context token, and the token's own recipe. An interactive token gives its rest, and its disabled in the disabled state. It is
  what 0.14 did with the foreground recipes, for any token that reads the context.
- **`activeFollowsRest`** keeps the rest in the active state when the rest and the hover are the same. Black or white has it, as in 0.14,
  so it doesn't flip on press; it spans states, so it can't be made in one context. It is an option of the pair, not metadata of the
  token. A value that moves by its own deltas, like a stroke, doesn't have it.
- Black or white for the context are tokens, `color.blackOrWhite.discernible` and `.readable` (the rest, and 30% opacity disabled), so
  they are made on a fill like the strokes.
- A rule refers to a pair by `--<token>-on-<fill>` (and `-<state>`). The pairs are not tokens of the library: `styleRulesOnFills` gives
  the pairs of the style rules of a component, and `onFillCSS` writes their custom properties for a scope, beside `toCSS`.
  `libraryTokenProperties` is given the context token (`context`) and gives the states a pair has.
- The context token is given, not known by `core`: it is the system's (`color.context` in the reference).

## Consequences

- Any combination works, and the token model has only tokens. The designer offers tokens, and a pair is a choice of two.
- The values are those of 0.14: the same as the `onFill` tokens for all 1,505 values of 7 scenarios, and the specs check them against the
  0.14 recipes in 6 scenarios.
- The CSS of the tokens of a scope has to be given the pairs of the components that use it. The `aui` CLI writes the CSS of the components
  and doesn't report their pairs yet, and an anatomy written as JSON can't say a value on a fill yet.
- A gradient fill can't be a context, which is a color, and is an error. No fill of the reference system is a gradient.
- A value on a fill in the treatment of the focus is an error: the focus of a pair isn't a value of its own.
- The direction is that an element with a fill sets the context of its content, in each state, as a layer does for its content (a tree item
  whose hover changes its fill, with a button in it). A pair is that, for one value; the context of a scope would be that for all of them.

## Alternatives

- **The pairs as tokens** (decision 0012): a fixed grid in the token model, which a new combination has to add to.
- **The pairs as tokens hidden from the model**, an extension of the library that the reference treatments make: out of the types, but
  still a list made by hand.
- **A foreground recipe as a function in the treatment**, `(background) => config`: not plain data, and the recipe is already in the token.
- **`activeFollowsRest` as metadata of the black or white tokens**: it would be on the token, where only a pair reads it.
- **`activeFollowsRest` for every pair**: moves 20 stroke values of the reference in the active state, by a swatch or two now, and more
  with deltas that go from light to dark.
- **No `activeFollowsRest`**: 5 values of the ideal fills would flip from black to white on press.
- **A band of luminance as the context, chosen in CSS**: a value for each band and palette instead of each fill, at run time. Later, with the
  context of a fill; it changes the values.
