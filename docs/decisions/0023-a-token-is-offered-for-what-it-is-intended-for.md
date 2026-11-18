# 0023. A token is offered for what it is intended for, or else for what its type can be

- Status: Accepted
- Date: 2026-11-18
- Package: adaptive-ui-designer-figma-plugin

## Context

The plugin offers the tokens that a designer applies to a style property of a node: a fill to the background, a thickness to the border. In
0.14 a registry of "appliable" tokens was built by hand, each with the style properties it was `intendedFor`. A token of the library has
`intendedFor` in its `$extensions` (`getIntendedFor`), but the reference library doesn't give it to every token a designer would apply:
`typography.fontFamily.body` and `elevation.dialog` have none, and the ones that have it are the colors, the dimensions, and the expressions.

A `$type` doesn't tell the property. A `color` token is a fill of the background, the border, or the text; a `dimension` is a radius, a
thickness, or a gap; an `interactive` token is a set of any of them. A `fontFamily` or a `shadow` is for one.

## Decision

- **`intendedFor` narrows, it doesn't require.** It helps an author organize a library, and where a token has it, the token is offered for
  those properties only. A library author is not asked to give it to a token whose type says the property already (a `fontFamily`, a `shadow`).
- **Where a token has none, it is offered for every property its `$type` can be**: the `fontFamily`, `fontWeight`, `fontStyle`
  (`fontStyle`), `fontVariations` (`fontVariationSettings`), and `shadow` types for their one; a `color`, a `paint`, and a `gradient` the
  same, for the fills (background, foreground, borders, outline); and a `dimension` and an `expression` the same, for the thicknesses,
  radii, spacing, sizes, and text metrics. A designer may then apply a token in a way that wasn't meant. The alternative is a token that
  is not visible, which looks like a bug of the plugin.
- **An `interactive` token is by the value of its states**, since its type doesn't say it: the library gives the value of the first state
  that has one, and a paint, a list of shadow layers, or a dimension has the properties it would have as a token of its own.
- **A type that is a parameter and not a value of a style property** (`delta`, `number`, `palette`, `boolean`, `contrastRatio`) is not
  offered. The color context is offered like any other color: setting it on a fill is how a cutout is made, which isn't the way
  to make one, but it comes up.
- The names are `appliesTo` in the catalog (`ui/tokens/catalog.ts`), which reads the library and has no list of its own, so a token that is
  added to the library is offered without a change to the plugin.

## Consequences

- The plugin has no registry to keep in step with the library, and a token that is deprecated is not offered.
- A token that is offered where it doesn't belong is missing its `intendedFor`. That is for the library of the tokens, `reference`, to
  narrow, and it is optional.
- The table of types is the plugin's, and a type that is added to the library (a `duration`, a `strokeStyle`) is added to it.

## Alternatives

- **A list in the plugin of the tokens by property**, as 0.14 had. It is the same facts twice, and a token added to the library is missing
  until the list is changed.
- **Not offer a token of a type that is for many, without `intendedFor`.** It puts the work on the library author, and a token that
  doesn't show looks broken.
