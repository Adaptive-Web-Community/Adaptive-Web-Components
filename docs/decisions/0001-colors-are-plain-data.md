# 0001. Colors, palettes, and gradients are plain data with functions

- Status: Accepted
- Date: 2026-10-17
- Package: adaptive-ui

## Context

The token model moves to the [design token library](https://github.com/nicholasrice/design-token-library), which is aligned with the
[DTCG format](https://www.designtokens.org/). The value of a token is plain data there: a function in a value is an alias, a class
instance was flattened to a plain object and its own function properties were called (library #55), and the values are serialized to
JSON for the designer and the Figma plugin.

`Color`, `Palette`, and the gradients were classes with methods, which `@cssDirective` tied to FAST. A token can't hold one as it is.

## Decision

- A `Color` **is** the library's `DesignToken.Values.Color`, a DTCG color in any color space. A type alias, with a type-only import. The colors
  that the functions create are `srgb`.
- A `Palette` is `{ source, swatches }`. Looking in one is a function: `swatchAt`, `closestSwatchIndex`, `reversedSwatches`. What is
  derived from a palette is cached in a `WeakMap` by the palette, which is frozen.
- A `Gradient` stays our own, with a type, an angle, and the unit and end of a stop, since DTCG has only the stops. Every function that
  takes a paint also takes a DTCG gradient, which is a linear gradient from the top to the bottom, like CSS without an angle.
- A recipe is a plain function over this data. The ones that return a set take the deltas as an object and the rest as options, in place of up
  to ten positional arguments.
- A semitransparent color has an unknown relative luminance (`NaN`), unless it is an overlay from `asOverlay`, which keeps the color it stands in
  for as `intendedColor` and uses that one.
- A **swatch** is only a color that is in a palette. A function that gets a color from a palette is named for a color (`deltaColor`).

## Consequences

- What was an instance member is a function of the data (`color.toString()` is `formatColor(color)`). That is a break, which
  [MIGRATION.md](../../packages/adaptive-ui/MIGRATION.md) lists with the function to use, and [0002](0002-deprecated-names-for-the-beta.md) covers.
- Values are frozen. A cache by the identity of the object doesn't hit for an equal object that is a different one, which is only a cost.
- `intendedColor` is not DTCG. A tool that only knows DTCG ignores it, and then sees the overlay as a color with opacity.
- `core/color` depends on the types of the library, as a type-only import, and not at runtime.

## Alternatives

- **Keep the classes, and let the library hold opaque values.** It would need an exception in the library for what isn't data, and the values
  would not go through JSON, which the designer and the Figma plugin need.
- **Data with methods attached as non-enumerable properties.** Only the colors made by a function would have them, and a color from a
  token, a file, or the designer wouldn't, which is worse than none.
- **Our own shape with an adapter to the DTCG color.** The spike did this, and every read converts. A DTCG color is enough.
