# Migrating from 0.14 to 1.0

The 1.0 beta moves the design tokens to the [design token library](https://github.com/nicholasrice/design-token-library),
and the colors, palettes, and gradients to plain data with functions. The beta is not a drop in replacement, but where a
name only changed, or a call can be adapted, the old one is still exported and deprecated, with what to use instead.
Everything that is deprecated is removed before 1.0.

This is updated as each part of the package is migrated. A part that is not in this list has not changed yet.

## Colors, palettes, gradients, and recipes

A color is a [DTCG color](https://www.designtokens.org/tr/2025.10/color/) object, and a palette and a gradient are plain
objects too. What was a method of one is a function of it.

### Renamed, the old name is the new one

| 0.14 | 1.0 |
| --- | --- |
| `_black`, `_white` | `black`, `white` |
| `luminanceSwatch` | `luminanceColor` |
| `swatchAsOverlay` | `colorAsOverlay` |
| `interactiveSwatchSetAsOverlay` | `colorSetAsOverlay` |
| `conditionalSwatchSet` | `conditionalColorSet` |
| `PaletteDirectionValue` | `PaletteDirection` |
| `deltaSwatch` | `deltaColor` |
| `contrastSwatch` | `contrastColor` (can also start the search at an index) |

A swatch is now only a color that is in a palette, like `palette.swatches` and `swatchAt`.

### Adapted, the old call works

| 0.14 | 1.0 |
| --- | --- |
| `deltaSwatchSet(palette, reference, rest, hover, active, focus, disabled, disabledPalette, direction, zeroAsTransparent)` | `deltaColorSet(palette, reference, deltas, options)` |
| `contrastAndDeltaSwatchSet(...)` | `contrastAndDeltaColorSet(palette, reference, minContrast, deltas, options)` |
| `idealColorDeltaSwatchSet(...)` | `idealColorDeltaSet(palette, reference, minContrast, idealColor, deltas, options)` |
| `resolvePaletteDirection(direction)` | a direction is only a value |
| `Color.parse`, `Color.from`, `Color.fromRgb`, `Color.transparent`, `Color.isTransparent`, `Color.asOverlay`, `Color.unsafeOpacity` | `parseColor`, `rgbColor`, `transparent`, `isTransparent`, `asOverlay`, `withAlpha` |
| `PaletteRGB.from`, `PaletteOkhsl.from` | `createPaletteRGB`, `createPaletteOkhsl` |
| `new LinearGradient(...)`, `new ConicGradient(...)`, `new RadialGradient(...)` | `linearGradient`, `conicGradient`, `radialGradient` |

The deltas of the sets are `{ rest, hover, active, focus, disabled }`, all of them, where `deltaSwatchSet` used the rest
delta when there wasn't one for the disabled state, and the options are `{ disabledPalette, direction, zeroAsTransparent }`.

### Replaced by a function, the old member is gone

The objects are plain data now, so what was a method or a property is a function of the object.

| 0.14 | 1.0 |
| --- | --- |
| `color.toString()`, `color.createCSS()` | `formatColor(color)` |
| `color.relativeLuminance` | `colorLuminance(color)`, or `relativeLuminance(paint)` for a color or gradient |
| `color.contrast(other)` | `contrast(color, other)` |
| `color.color` (the color of culori) | the color is the DTCG color, `toCulori(color)` has the one of culori |
| `gradient.toString()`, `gradient.createCSS()` | `formatGradient(gradient)` |
| `palette.get(index)` | `swatchAt(palette, index)` |
| `palette.closestIndexOf(reference)` | `closestSwatchIndex(palette, reference)` |
| `palette.delta(reference, delta, direction)` | `deltaColor(palette, reference, delta, direction)` |
| `palette.colorContrast(reference, minContrast, startIndex, direction)` | `contrastColor(palette, reference, minContrast, direction, startIndex)` |
| `palette.lastIndex`, `palette.reversedSwatches` | `palette.swatches.length - 1`, `reversedSwatches(palette)` |
| `BasePalette` | `createPalette(source, swatches)` |
| `RelativeLuminance` | `relativeLuminance(paint)` and `contrast(a, b)` |
| `DesignTokenMultiValuePaint` | a list of paints is a list in the value of a token |
| the `PaletteDirection` that could be a function | a direction is only a value |

### Behavior

- A color that has opacity has an unknown relative luminance (`NaN`), as before, unless it is an overlay from `asOverlay`,
  which keeps the color it stands in for as `intendedColor`.
- A gradient may also be a DTCG gradient, a list of stops with a color and a position from 0 to 1, which is a linear
  gradient from the top to the bottom for what needs the rest.
- Colors, palettes, and gradients are frozen.

### Removed with the tokens they were for

These were types and functions of the design tokens that are replaced by the token library. A recipe is a function now.

`ColorRecipe`, `ColorRecipeBySet`, `ColorRecipeBySetEvaluate`, `ColorRecipeEvaluate`, `ColorRecipePalette`,
`ColorRecipePaletteEvaluate`, `ColorRecipePaletteParams`, `ColorRecipeParams`, `InteractiveColorRecipe`,
`InteractiveColorRecipeBySet`, `InteractiveColorRecipeBySetEvaluate`, `InteractiveColorRecipeEvaluate`,
`InteractiveColorRecipePalette` and `InteractiveColorRecipePaletteEvaluate`.

## Derived values are expressions

A value that is calculated from other tokens is an expression, plain data of numbers, dimensions, references to tokens,
and math. It is written to CSS as a `calc()` of the custom properties of the tokens it refers to, so a change to one of
the tokens still changes the result in the browser. This is new, there is nothing to replace, except a `calc()` string
that was the value of a token.

| 0.14 | 1.0 |
| --- | --- |
| a `calc(...)` string as the value of a token | an expression of `add`, `subtract`, `multiply`, `divide`, `pow`, `round`, `min`, and `max`, with `ref(token)` for a token in it |
| `resolve(token)` in a function value | `ref(token)`, which refers to the token itself and not to its name |

A token of the `expression` type holds a number, a dimension, or an expression. `evaluate` gets the number or dimension of
an expression when it is needed in code, with the rules of units that CSS has. Any `calc()` string that was written for a
value of a token needs to be written as an expression, since a string is no longer a value of a token that is calculated.

## Not migrated yet

The tokens, the type ramps, the styles, the shadows and elevation, and `ElementStylesRenderer` are still the ones of 0.14,
and are replaced in the steps that follow. The deprecated names of the tokens are exported with each one.
