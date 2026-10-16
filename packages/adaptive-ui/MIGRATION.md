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
| `PaletteOkhsl.from` | `createPaletteOkhsl` |
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
- Colors, palettes, and gradients are frozen, and their types are readonly, as the values of tokens are.

### Removed

| 0.14 | 1.0 |
| --- | --- |
| `PaletteRGB`, `PaletteRGBOptions` | `createPaletteOkhsl`, whose steps are perceptually even, or `createPalette(source, swatches)` for swatches of your own |

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
| a `calc(...)` string as the value of a token | an expression of `add`, `subtract`, `multiply`, `divide`, `pow`, `round`, `min`, and `max`, with a ref of the library (`refs<Tokens>().size`, or `ref("size")`) for a token in it |
| `resolve(token)` in a function value | a ref of the library, which is typed by the value of the token |

A token of the `expression` type holds a number, a dimension, or an expression. `evaluate(value, library)` gets the number
or dimension of an expression when it is needed in code, with the values of the tokens of the library and the rules of
units that CSS has. Any `calc()` string that was written for a
value of a token needs to be written as an expression, since a string is no longer a value of a token that is calculated.

## Type ramps

A type ramp is a set of tokens in a library, from `minus2` to `plus6`, whose positions are fixed or calculated from a
scale. It is one thing, so a scale is a ramp that has the tokens of the scale next to the positions
(`docs/decisions/0005-a-type-ramp-is-a-ramp.md`).

| 0.14 | 1.0 |
| --- | --- |
| `new TypeRampTokenGroup(name, ...positions)` | `typeRamp({ minus2, minus1, base, ... })`, the configuration of a group of the library |
| `new TypeScaleTokenGroup(name, baseSize, multiplier, lineHeightRatio, lineHeightMultilineRatio, lineHeightSnap)` | `typeScale(scale, baseSize, multiplier, lineHeightRatio, lineHeightMultilineRatio, lineHeightSnap)`, where `scale` is the refs of its group, `refs<Tokens>().typography.ramp.body` |
| `ramp.base.fontSize` (the tokens of a position) | `ramp.fontSize.base` (the positions of a property), which is the name the tokens had: `typography.ramp.default.fontSize.base` |
| `TypeRampPosition` (a class of the tokens of a position) | `TypeRampPosition` is the name of a position, `"minus2"` to `"plus6"`, and `typeRampPositions` is the list |
| a size or a line height as a string, `"14px"` | a dimension, `px(14)`, or any expression |

The name of the group is where the group is in the library, not an argument, and `typeScale` takes the refs of its group,
since the positions refer to the tokens next to them. The base size and the line height snap of a scale
are dimensions, and the positions are expressions of the tokens of the scale (`calc(base * pow(multiplier, 2))`, and
`round(fontSize * lineHeightRatio, lineHeightSnap)` for the line heights), where they were `calc()` strings that the class
wrote, so a change to the multiplier, the ratios, or the snap changes the whole ramp as before. The font variations of a
position are still empty.

## Typography tokens

The tokens of the default, body, and label fonts and the type ramps are a group `typography` of a library, `typography` is
its configuration, and `createTypographyLibrary()` creates a library of only these. The names of the tokens and their
values are the same as before, with these changes:

- A font family is a list, as DTCG has it: `["Arial", "Helvetica", "sans-serif"]`.
- A font weight is a number or a DTCG keyword, and the default is `"normal"`. `StandardFontWeight` is not needed.
- There is a new type ramp for body copy, `typography.ramp.body`, a scale of `16px` with a multiplier of `1.21` and a line
  height ratio of `1.35`.
- The tokens are not instances of a class, so they don't have `withDefault`, `getValueFor`, or `setValueFor`. A token of the
  library has its value, `token.$value`, and `token.set(value)`.

## Not migrated yet

The other tokens, the styles, the shadows and elevation, and `ElementStylesRenderer` are still the ones of 0.14,
and are replaced in the steps that follow. The deprecated names of the tokens are exported with each one.
