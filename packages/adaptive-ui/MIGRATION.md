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
| `disabledPalette` | `color.disabled.palette`, the palette of the layers (the neutral palette) until it is set |
| `colorContext` | `color.context`. A layer is `library.extend({ color: { context: { $value: layerColor } } })` |
| `layerPalette` | `color.layer.palette` |
| `layerFillBaseLuminance` | `color.layer.fill.ramp.baseLuminance` |
| `layerFillRestDelta` | `color.layer.fill.restDelta` |
| `layerFillHoverDelta`, `layerFillActiveDelta`, `layerFillFocusDelta`, `layerFillDisabledDelta` | `color.layer.fill.interactiveDeltas.<state>`, where `rest` is a ref to `restDelta` |
| `layerFillFixedBase`, `layerFillFixedMinus1`..`4`, `layerFillFixedPlus1`..`4` | `color.layer.fill.ramp.base`, `minus1`..`minus4`, `plus1`..`plus4` |
| `layerFillFixedRecipe`, `layerFillInteractiveRecipe` | not tokens: `layerRecipes.rampFill` and `layerRecipes.interactiveFill`, recipes of the library, which `override()` replaces in an extended library |
| `layerFillInteractive`, `layerFillInteractiveRest`, `Hover`, `Active`, `Focus`, `Disabled` | `color.layer.fill.interactive`, one token whose value is `{ rest, hover, active, focus, disabled }`. In CSS the rest is `--color-layer-fill-interactive`, not `...-interactive-rest` |
| `LayerBaseLuminance` | `LayerBaseLuminance` |

### Deprecated, the old name is the token

`neutralBaseColor`, `neutralPalette` (and the other palettes), `disabledPalette`, `colorContext`, `layerPalette`, `layerFillBaseLuminance`, `layerFillRestDelta`,
`layerFillHoverDelta`, `layerFillActiveDelta`, `layerFillFocusDelta`, `layerFillDisabledDelta`, `layerFillFixedBase`,
`layerFillFixedMinus1`..`4`, `layerFillFixedPlus1`..`4` and `layerFillInteractive` are exported from `reference/deprecated.ts`, each the
token of the table above in the library that Adaptive UI creates. What a token is has changed, see the typography tokens.

Not exported, with what to use: `layerFillInteractiveRest`, `Hover`, `Active`, `Focus` and `Disabled` (a state of an interactive token is not a
token: use `layerFillInteractive.$value.rest`, or `--color-layer-fill-interactive-<state>` in CSS), and `layerFillFixedRecipe` and
`layerFillInteractiveRecipe` (the recipes are not tokens: they are `layerRecipes.rampFill` and `layerRecipes.interactiveFill`).

`InteractiveValues<T>` (a value for each of the five states) is renamed `InteractiveSet<T>`, in which every state is optional: a set has the states that it has, and `null` clears one. The old name is
still exported, deprecated, with the meaning it had. Use `Record<InteractiveState, T>` where there has to be a value for each state.

A palette is a token of the `palette` type, and is not CSS: it has no custom property. `paletteRecipes.paletteFrom(color, stepSize)` makes the
palette of a color token, for a palette of a system's own. A delta is a token of the `delta` type, and is not CSS either, as it wasn't in 0.14,
since only a recipe reads it.

### Interactive values

The values of the states of an interactive element (`rest`, `hover`, `active`, `focus`, `disabled`) are one token of the `interactive` type, `InteractiveToken<V>`, whose value is `InteractiveSet<V>`, and not a token for each
state, see [decision 0006](../../docs/decisions/0006-interactive-values-are-one-token.md). The value of the token is a recipe of the library, so it is calculated once. The deltas that it reads are tokens of the `delta` type in a group
(`InteractiveDeltaTokens`, of the states that it says, all five unless it says `InteractiveDeltaTokens<InteractiveState.hover | InteractiveState.active>`), and the recipes take them as an `InteractiveSet<number>` and give a color for each state that has one. In CSS `--x` is the rest and a state is `--x-<state>`, and only a state that has a value is written. The recipe functions (`deltaColorSet` and the others) are as they were,
and a set of colors is an `InteractiveToken<Color>`, the `InteractiveColorSet` that they give: the recipe decides which states have a color, and a state that has no value is not there
(`null` clears one on purpose), so not even the `rest` is needed.

## Color sets

The 84 color sets (a fill or a stroke of each of the seven palettes), the minimum contrasts, the deltas of the recipes, the focus stroke, and the
foreground of black or white are tokens in the library, in the `color` group (`color` is the config and `createColorLibrary()` is a library of
the colors, the palettes, the color context, and the layers). The parity snapshot gives the same colors for every set and for the focus stroke
in all the scenarios. Each set is one interactive token whose value is `{ rest, hover, active, focus, disabled }`,
and not a token for each state. The recipes are the same functions as before. A minimum contrast is a token of the `contrastRatio` type,
a delta one of the `delta` type, the WCAG level one of the `wcagContrastLevel` type, and a switch like `asOverlay` one of the `boolean`
type. None of them is CSS, as in 0.14, since only a recipe reads them.

| 0.14 | 1.0 |
| --- | --- |
| `accentFillStealth` (and `highlight`, `critical`, `warning`, `success`, `info`, `neutral`; `Stealth`, `Subtle`, `SubtleInverse`, `Ideal`, `Discernible`, `Readable`) | `color.accent.fill.stealth` etc. |
| `accentStrokeSafety` (and the others; `Safety`, `Stealth`, `Subtle`, `Discernible`, `Readable`, `Strong`) | `color.accent.stroke.safety` etc. |
| `accentFillStealthRecipe` etc., `createTokenColorRecipeAccent` (and the others), `createTokenColorSet` | not tokens: a set is what the recipe made, and the recipes are `colorRecipes`, recipes of the library that `override()` replaces in an extended library. `createColorSets({ palette })` makes the sets of a palette of a system, from a ref to its palette token |
| `fillStealthRestDelta`, `fillStealthHoverDelta`, ... (`fill`: `Stealth`, `Subtle`, `Ideal`, `Discernible`, `Readable`; `stroke`: `Safety`, `Stealth`, `Subtle`, `Discernible`, `Readable`, `Strong`) | `color.deltas.fill.stealth.rest`, `.hover`, `.active`, `.focus`, `.disabled` etc. `subtleInverse` reads `subtle` the other way and has none of its own |
| `fillIdealRecipe` etc. (`color.shared.*.recipe`) | not tokens |
| `wcagContrastLevel` | `color.wcagContrast.level`, a token of the `wcagContrastLevel` type |
| `minContrastSafety`, `Subtle`, `Ideal`, `Discernible`, `Readable` | `color.wcagContrast.minContrast.safety` etc. |
| `strokeStrongMinContrast` | `color.wcagContrast.minContrast.strong` |
| `neutralAsOverlay` | `color.neutral.asOverlay`, a token of the `boolean` type |
| `focusStrokePalette`, `focusStrokeMinContrast` | `color.focusStroke.palette`, `color.focusStroke.minContrast` |
| `focusStroke`, `focusStrokeOuter`, `focusStrokeInner` | `color.focusStroke.$root` (CSS `--color-focusStroke`), `color.focusStroke.outer`, `color.focusStroke.inner` |
| `blackOrWhiteDiscernibleRecipe`, `blackOrWhiteReadableRecipe` (a recipe that a style module composed with a background) | `blackOrWhiteDiscernible(background)` and `blackOrWhiteReadable(background)`, the config of an interactive token that follows the background (a ref to it), for the pairs that a system makes |
| `WcagContrastLevel` | `WcagContrastLevel`, with `WcagContrastLevelToken` |

### Deprecated, the old name is the token

The sets (`accentFillStealth` and the other 83), the deltas (`fillStealthRestDelta` and the other 54), `wcagContrastLevel`, `minContrastSafety`..`minContrastReadable`,
`strokeStrongMinContrast`, `neutralAsOverlay`, `focusStrokePalette`, `focusStrokeMinContrast`, `focusStroke`, `focusStrokeOuter`, and `focusStrokeInner` are exported from
`reference/deprecated.ts`, each the token of the table above in the library that Adaptive UI creates. What a token is has changed, see the typography tokens.

Not exported, with what to use: the token of a state of a set (`accentFillStealthRest`, `Hover`, and so on: use `accentFillStealth.$value.rest`, or the property `--<name>-<state>` in CSS), and the recipes
(`accentFillStealthRecipe` and the others, `blackOrWhiteDiscernibleRecipe`, `blackOrWhiteReadableRecipe`, and `createTokenColorRecipeAccent` and the others).

### Disabled

The disabled color is fixed in tokens (decision [0008](../../docs/decisions/0008-disabled-is-fixed-in-tokens.md)), so the colors are the same:

- Every recipe with a color at rest has the disabled delta of its kind, `color.disabled.fillDelta` (3) or `color.disabled.strokeDelta` (8), as a ref in its own
  `disabled` delta. The stealth and safety recipes have `0` (transparent). The number is the same as before, so the colors are.
- The disabled palette is the palette of the layers until it is set, which is the neutral palette until it is set, so the colors are the same by default.
- The focus delta of each recipe is its rest delta until it is set.

## Shadows and elevation

A shadow is the DTCG shadow value of the token library (`DesignToken.Values.Readonly.Shadow`), one layer or several, and not a class:
`shadow(color, offsetX, offsetY, blur, spread)` makes a layer in `px`, and the library's `convert(DesignToken.Type.Shadow, shadow)` writes it as
it writes a shadow token. The shadows of the elevation are tokens in the library, in the `elevation` group (`elevation` is the config and
`createElevationLibrary()` is a library of the shadows and the colors they read). The core has no elevation: the shadow of a height is the
reference system's, as it was.

| 0.14 | 1.0 |
| --- | --- |
| `new Shadow(color, xOffset, yOffset, blurRadius, spread)` | `shadow(color, offsetX, offsetY, blur, spread)` |
| `shadow.createCSS()` | `convert(DesignToken.Type.Shadow, shadow)`, from the library |
| `shadow.xOffset`, `yOffset`, `blurRadius`, `spread` (numbers) | `shadow.offsetX`, `offsetY`, `blur`, `spread` (dimensions, `{ value, unit: "px" }`) |
| a `DesignTokenMultiValue` of shadows | a list of layers, which a DTCG shadow can be |
| `ShadowValue`, which could be a string | `DesignToken.Values.Readonly.Shadow`, from the library |
| `createTokenShadow(name)` | a token of the `shadow` type in the config |
| `elevationRecipe`, a token whose value was the recipe | `elevationRecipes.elevationShadow(color, size)`, a recipe of the library, which a system replaces with `override()` |
| `ElevationRecipe`, `ElevationRecipeEvaluate` | none: an override of `elevationShadow` takes its types, a function of the color and the size that returns any shadow |
| `elevationTooltip`, `elevationFlyout`, `elevationDialog` | `elevation.tooltip`, `elevation.flyout`, `elevation.dialog` (the `$root` of each; CSS `--elevation-tooltip`) |
| `elevationTooltipSize`, `elevationFlyoutSize`, `elevationDialogSize` | `elevation.tooltip.size`, `elevation.flyout.size`, `elevation.dialog.size`, of the `delta` type |
| `elevationCardInteractive`, `elevationCardRest`, `Hover`, `Active`, `Focus`, `Disabled` | `elevation.card`, one interactive token whose value is `{ rest, hover, active, focus, disabled }`. In CSS the rest is `--elevation-card` and a state is `--elevation-card-<state>` |
| `elevationCardRestSize`, `HoverSize`, `ActiveSize`, `FocusSize`, `DisabledSize` | `elevation.card.deltas.rest` etc., the card's deltas (`InteractiveDeltaTokens`) |

### Behavior

- The shadows have the same layers, offsets, blurs, and opacities as before, from the same sizes.
- The color the shadows are cast in is a token, `elevation.color`, the rest of `color.neutral.stroke.strong` until it is set. The recipe read that
  stroke itself, so a system changed the shadow color only by changing the recipe.
- A shadow is written with its blur and spread, `0px 4px 8px 0px`, where a zero was left out. CSS reads them the same.
- The sizes are of the `delta` type, which a recipe reads, and are not in CSS, as in 0.14.

### Deprecated, the old name is the token

`elevationCardInteractive`, `elevationCardRestSize`..`elevationCardDisabledSize`, `elevationTooltip`, `elevationTooltipSize`, `elevationFlyout`,
`elevationFlyoutSize`, `elevationDialog`, and `elevationDialogSize` are exported from `reference/deprecated.ts`, each the token of the table above in
the library that Adaptive UI creates. `new Shadow(...)` makes a layer with `shadow()`, and the types `Shadow` and `ShadowValue` are the library's shadow layer and shadow.

Not exported, with what to use: the token of a state of the card (`elevationCardRest`, `Hover`, and so on: use `elevationCardInteractive.$value.rest`, or
`--elevation-card-<state>` in CSS), `elevationRecipe` (`elevationRecipes.elevationShadow`), `createTokenShadow`, and the recipe types.

## Appearance and density

The design unit, the corner radius, the stroke thickness (`appearance`), and the density (`density`) are tokens of a library, and
`createDensityLibrary()` is a library with both. The names, values, and the padding and gap that are calculated are the same as before (the parity
snapshot has the same pixels for every design unit, stroke thickness and adjustment). The padding and the gap are expressions of the units, the
adjustment, and the design unit, so in CSS they are `calc()` of the custom properties.

| 0.14 | 1.0 |
| --- | --- |
| `designUnit` | `global.designUnit` |
| `cornerRadiusControl` | `shape.cornerRadius.default` |
| `cornerRadiusLayer` | `shape.cornerRadius.layer`. It was `density.layer.cornerRadius`, and is with the other appearance tokens, so its custom property is `--shape-cornerRadius-layer` |
| `strokeThickness`, `focusStrokeThickness` | `shape.strokeThickness.default`, `shape.strokeThickness.focus` |
| `densityAdjustmentUnits` | `density.adjustmentUnits` |
| `densityText`, `densityControl`, `densityControlList`, `densityLayer` | `density.text`, `.control`, `.controlList`, `.layer` |
| `densityControl.horizontalPadding` (and the other properties of the group) | `density.control.horizontal.padding`, `.horizontal.gap`, `.vertical.padding`, `.vertical.gap`, and `paddingUnits` and `gapUnits` of each |
| `new DensityPaddingAndGapTokenGroup(name, 3, 2, 2, 1, designUnit, border)` | `createDensity(name, { horizontalPadding: 3, ... }, designUnit, borderThickness)`, which gives the config of a density set at its name, to spread into the `density` tokens of a library, as the default sets are |
| `group.padding` (the `css` partial of the vertical and horizontal padding) | the vertical and horizontal padding, one each |

### Deprecated, the old name is the token

`designUnit`, `cornerRadiusControl`, `cornerRadiusLayer`, `strokeThickness`, `focusStrokeThickness`, `densityAdjustmentUnits`, and the four density
groups are exported from `reference/deprecated.ts`, each the token of the table above. A group is an object with the property names of the old
class (`horizontalPadding`, `verticalGapUnits`, ...), each the token of the library. `padding` and the class are not.

## Treatments and the rendering of styles

A style module is a **treatment** (`Treatment`), a named set of style properties that is plain data: `{ name, treatments, properties }`, where
`treatments` are the ones it is composed of and `properties` are applied after them, see
[decision 0012](../../docs/decisions/0012-a-treatment-is-a-named-set-of-style-properties.md). A value refers to a token by a ref of the library
(`refs<ReferenceLibraryTokens>().color.accent.fill.readable`), and in a set of values a ref to an interactive token is the token in that
state. Styles render to rules of CSS with `renderRules` and `renderStyleRules`, and `formatRules` writes them, without FAST and without a DOM
([decision 0011](../../docs/decisions/0011-styles-render-to-css-without-fast.md)). The styling is in `core/styles`, and its CSS output in
`core/styles/css`.

| 0.14 | 1.0 |
| --- | --- |
| `Styles` | `Treatment`, an object |
| `Styles.fromProperties(properties, name)` | `{ name, properties }` |
| `Styles.compose(styles, properties, name)` | `{ name, treatments, properties }` |
| `Styles.fromDeclaration(declaration)`, `styles.effectiveProperties` | `treatmentProperties(treatmentOrRule)` |
| `Styles.Shared`, the registry by name | `referenceTreatments`, a list that an anatomy written as data is looked up in |
| `styles.properties = ...`, `appendComposed`, `clearComposed` | a new treatment: a treatment isn't changed |
| `effectiveAdaptiveProperties` | `treatmentProperties`, with the keys that are a `StyleProperty` |
| `StyleDeclaration`, a rule's `styles` and `properties` | a rule's `treatments` and `properties` (`StyleRule`) |
| `StyleModuleTarget` | `StyleRuleTarget` |
| `StyleModuleEvaluateParameters` | `SelectorParameters` |
| `StyleValue` (a FAST token, an `InteractiveValues`, a `CSSDirective`, or a value) | `StyleValue` (a value of CSS or of a token type, or a ref) and `StyleValues` (one or an `InteractiveSet` of them) |
| `StylePropertiesMap`, `EffectiveStylePropertiesMap` | `Map<string, StyleValues>` |
| `Fill.backgroundAndForeground(fill, recipe)`, `Fill.backgroundAndForegroundBySet(fill, recipe)` | `{ backgroundFill: color.accent.fill.subtle, foregroundFill: color.accent.onFill.subtle }`: the foreground on a fill is a token |
| `Fill.backgroundNonInteractive(token, disabled)`, `Fill.foregroundNonInteractive(token, disabled)` | `{ rest: token, disabled }`, a set that has only those states |
| `convertStylesToFocusState(styles)` | part of `renderStyleRules`, which applies the focus indicator in the focus state |
| `ElementStylesRenderer`, `new ElementStylesRenderer(styles).render(target, interactivity)` | `renderRules(treatmentProperties(treatment), { ...interactivity, ...target }, libraryTokenProperties(library))` |
| `ElementStylesRenderer.renderStyleRules(base, rules, anatomy)` | `renderStyleRules(rules, { tokens: libraryTokenProperties(library), anatomy, treatments: referenceAnatomyTreatments })` |
| `ElementStylesRenderer.disabledStyles`, `focusStateStyles`, `focusResetStyles` | the `treatments` of `renderStyleRules` (`AnatomyTreatments`: `disabled`, `focusIndicator`, `focusReset`) |
| the `...Styles` of `reference/modules.ts`, like `actionStyles` | the `...Treatment` of `reference/treatments.ts`, like `actionTreatment`, with the same names |
| `StyleNameMapping` | `TreatmentNameMapping`, to the names of the treatments |

The foreground on each fill is a token, `color.<palette>.onFill.<fill>` (`stealth`, `subtle`, `subtleInverse`, `ideal`, `discernible`, and
`readable`) and `color.layer.onFill.interactive`, with the colors of 0.14 (the readable stroke of the palette on the stealth and subtle fills, the
strong neutral stroke on the neutral fills and the interactive layer, and black or white on the others). `createOnFill` makes the group for a
palette of a system, and `contrastAndDeltaColorBySet` is its recipe. `createReferenceLibrary()` is a library of the whole reference system, which
the reference treatments refer to.

### Behavior

- The CSS refers to the custom properties the library writes: `--color-accent-fill-subtle` at rest (was `-rest`), `--color-focusStroke`
  (was `-value`), and `--color-accent-onFill-subtle` (was `--color-accent-stroke-readable-on-accent-fill-subtle-rest`).
- A set has only the states that it has a value for (decision 0006), so a foreground of an element that isn't interactive, with a rest and a
  disabled, has no rules for the hover, the active, and the focus, which repeated the rest.
- The rules of the states are in the order rest, focus, hover, active, disabled. States that have the same selector, like those of a
  pseudo-element, are one rule, where the later state wins, as before.
- The `aui` CLI renders with the reference library and needs no DOM. An anatomy written as JSON names its treatments in `treatments` (was
  `styles`), and an unknown name is a warning. A property names a token by its path, and `<token>.rest` of an interactive token is its rest.
  Importing the root of the package still loads FAST, through the 0.14 token helpers that aren't migrated yet.

### Deprecated, the old name is the new one

The 99 `...Styles` of `reference/modules.ts` are exported from `reference/deprecated.ts`, each the `...Treatment` of the same name, and
`StyleNameMapping` is `TreatmentNameMapping`. `StyleModuleTarget` and `StyleModuleEvaluateParameters` are `StyleRuleTarget` and
`SelectorParameters`, and the type `Styles` is `Treatment`. `Styles.fromProperties(properties, name)` and `Styles.compose(treatments,
properties, name)` make a treatment. A rule's `styles` (one treatment or a list) is applied before its `treatments`, and an anatomy written as
JSON may name its treatments in `styles`.

Not exported, with what to use: `Styles.Shared` (`referenceTreatments`), `Styles.fromDeclaration` and `StyleDeclaration` (a rule),
`Fill` (the `onFill` tokens), `convertStylesToFocusState`, and `ElementStylesRenderer` (`renderStyleRules`).

## Not migrated yet

The rest of the tokens (`experimental`), the token helpers of 0.14 (`createTokenX`, `DesignTokenRegistry`), and `TokenNameMapping` are still
the ones of 0.14, and are replaced in the steps that follow. The deprecated names of the tokens are exported with each one.
