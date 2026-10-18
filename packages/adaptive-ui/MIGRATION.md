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

## Type ramps

A type ramp is a set of tokens in a library, from `minus2` to `plus6`, whose positions are fixed or calculated from a
scale. It is one thing, so a scale is a ramp that has the tokens of the scale next to the positions
(`docs/decisions/0005-a-type-ramp-is-a-ramp.md`).

| 0.14 | 1.0 |
| --- | --- |
| `new TypeRampTokenGroup(name, ...positions)` | `typeRamp({ minus2, minus1, base, ... })`, the configuration of a group of the library |
| `new TypeScaleTokenGroup(name, baseSize, multiplier, lineHeightRatio, lineHeightMultilineRatio, lineHeightSnap)` | `typeScale(select, baseSize, multiplier, lineHeightRatio, lineHeightMultilineRatio, lineHeightSnap)` |
| `ramp.base.fontSize` (the tokens of a position) | `ramp.fontSize.base` (the positions of a property), which is the name the tokens had: `typography.ramp.default.fontSize.base` |
| `TypeRampPosition` (a class of the tokens of a position) | `TypeRampPosition` is the name of a position, `"minus2"` to `"plus6"`, and `typeRampPositions` is the list |
| a size or a line height as a string, `"14px"` | a dimension, `px(14)`, or any expression |

The name of the group is where the group is in the library, not an argument, and `typeScale` takes the way to get its group
from the tokens, since the positions refer to the tokens next to them. The base size and the line height snap of a scale
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

### Deprecated, the old name is the token

The design tokens that were exported are still exported, and each is the token of the same name in a library, so what
used them keeps one name. Everything is deprecated, and what a token is has changed (above), so a use of `withDefault`,
`getValueFor`, or `setValueFor` needs to be updated.

| 0.14 | 1.0 |
| --- | --- |
| `fontFamily`, `bodyFontFamily`, `labelFontFamily` | `typography.fontFamily.default`, `.body`, `.label` |
| `fontWeight`, `bodyFontWeight`, `labelFontWeight` | `typography.fontWeight.default`, `.body`, `.label` |
| `fontStyle`, `bodyFontStyle`, `labelFontStyle` | `typography.fontStyle.default`, `.body`, `.label` |
| `typeRampDefault` | `typography.ramp.default` (and `typeRampDefault.fontSize.base`, not `typeRampDefault.base.fontSize`) |
| `StandardFontWeight` | a number, or a keyword like `"normal"` and `"bold"` |

These are the tokens of one library that Adaptive UI creates, so the tokens of a library that is made with `extend` are not
the ones that are exported. `TypeRampTokenGroup` and `TypeScaleTokenGroup` have no replacement of the name, see the type
ramps.

## Palettes, the color context, and the layers

These tokens are in the token library now, as a tree of tokens (`palettes`, `colorContext` and `layer` are the configs, and
`createLayerLibrary()` is a library with all of them). The tokens of the legacy `reference` that were the same value have the
same name (the CSS of a state is the exception, below), and the parity snapshot gives the same swatches and layer colors. The tokens that were exported are still
exported, deprecated, as in the typography tokens, see below.

| 0.14 | 1.0 |
| --- | --- |
| `neutralBaseColor`, `neutralPalette` (and `accent`, `highlight`, `critical`, `warning`, `success`, `info`) | `color.neutral.base`, `color.neutral.palette` |
| `paletteStepCount` | `color.paletteOptions.stepSize`, the step between swatches in points of lightness on a scale of 100, where the count is `floor(100 / stepSize)` (`1.5` is the 66 swatches). `stepCountFor(stepSize)` is the function. No deprecated name: the token is a size and not a count |
| `paletteLightEndSaturation`, `paletteDarkEndSaturation` | no tokens: they are the `lightEndSaturation` and `darkEndSaturation` options of `createPaletteOkhsl`, which a palette that is set as the value of a palette token can use |
| `disabledPalette` | `color.disabled.palette`, the neutral palette until it is set |
| `colorContext` | `color.context`. A layer is `library.extend({ color: { context: { $value: layerColor } } })` |
| `layerPalette` | `color.layer.palette` |
| `layerFillBaseLuminance` | `color.layer.fill.ramp.baseLuminance` |
| `layerFillRestDelta` | `color.layer.fill.restDelta` |
| `layerFillHoverDelta`, `layerFillActiveDelta`, `layerFillFocusDelta`, `layerFillDisabledDelta` | `color.layer.fill.interactiveDeltas.<state>`, where `rest` is the alias of `restDelta` |
| `layerFillFixedBase`, `layerFillFixedMinus1`..`4`, `layerFillFixedPlus1`..`4` | `color.layer.fill.ramp.base`, `minus1`..`minus4`, `plus1`..`plus4` |
| `layerFillFixedRecipe`, `layerFillInteractiveRecipe` | not tokens, the ramp and the interactive fill are what the recipes made |
| `layerFillInteractive`, `layerFillInteractiveRest`, `Hover`, `Active`, `Focus`, `Disabled` | `color.layer.fill.interactive`, one token whose value is `{ rest, hover, active, focus, disabled }`. In CSS the rest is `--color-layer-fill-interactive`, not `...-interactive-rest` |
| `LayerBaseLuminance` | `LayerBaseLuminance` |

### Deprecated, the old name is the token

`neutralBaseColor`, `neutralPalette` (and the other palettes), `disabledPalette`, `colorContext`, `layerPalette`, `layerFillBaseLuminance`, `layerFillRestDelta`,
`layerFillHoverDelta`, `layerFillActiveDelta`, `layerFillFocusDelta`, `layerFillDisabledDelta`, `layerFillFixedBase`,
`layerFillFixedMinus1`..`4`, `layerFillFixedPlus1`..`4` and `layerFillInteractive` are exported from `reference/deprecated.ts`, each the
token of the table above in the library that Adaptive UI creates. What a token is has changed, see the typography tokens.

Not exported, with what to use: `layerFillInteractiveRest`, `Hover`, `Active`, `Focus` and `Disabled` (a state of an interactive token is not a
token: use `layerFillInteractive.$value.rest`, or `--color-layer-fill-interactive-<state>` in CSS), and `layerFillFixedRecipe` and
`layerFillInteractiveRecipe` (the recipes are not tokens).

`InteractiveValues<T>` (a value for each of the five states) is renamed `InteractiveSet<T>`, in which every state is optional: a set has the states that it has, and `null` clears one. The old name is
still exported, deprecated, with the meaning it had. Use `Record<InteractiveState, T>` where there has to be a value for each state.

A palette is a token of the `palette` type, and is not CSS: the custom property is empty until the library can leave a token
out (design-token-library #58).

### Interactive values

The values of the states of an interactive element (`rest`, `hover`, `active`, `focus`, `disabled`) are one token of the `interactive` type, `InteractiveToken<V>`, whose value is `InteractiveSet<V>`, and not a token for each
state, see [decision 0006](../../docs/decisions/0006-interactive-values-are-one-token.md). The recipe is the alias of the token, so it is calculated once. The deltas that it reads are number tokens in a group
(`InteractiveDeltaTokens`, of the states that it says, all five unless it says `InteractiveDeltaTokens<InteractiveState.hover | InteractiveState.active>`), and the recipes take them as an `InteractiveSet<number>` and give a color for each state that has one. In CSS `--x` is the rest and a state is `--x-<state>`, and only a state that has a value is written. The recipe functions (`deltaColorSet` and the others) are as they were,
and a set of colors is an `InteractiveToken<Color>`, the `InteractiveColorSet` that they give: the recipe decides which states have a color, and a state that has no value is not there
(`null` clears one on purpose), so not even the `rest` is needed.

## Not migrated yet

The rest of the tokens, the styles, the shadows and elevation, and `ElementStylesRenderer` are still the ones of 0.14,
and are replaced in the steps that follow. The deprecated names of the tokens are exported with each one.
