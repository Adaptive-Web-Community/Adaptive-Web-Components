# Adaptive UI Color Recipes

Color recipes are algorithmic patterns that produce individual or sets of colors from a variety of inputs. Components can apply these recipes to achieve expressive theming options while maintaining color accessability targets.

## Color
A Swatch is a representation of a color that has a `relativeLuminance` value and a method to convert the swatch to a color string. It is the base type for color design tokens.

## Swatch
A Swatch is an extension of a Color for use in a recipe. It adds support for calculating a color as an overlay or transparency
over another Swatch.

**Example: Creating a Swatch**
```ts
import { Swatch } from "@adaptive-web/adaptive-ui";

const red = Swatch.fromRgb(1, 0, 0);
```

## Palette
A palette is a collection `Swatch` instances, ordered by relative luminance, and provides mechanisms to safely retrieve swatches by index and by target contrast ratios. It also contains a `source` color, which is the color from which the palette is derived.

### PaletteRGB
An implementation of `Palette` of `Swatch` instances with RGB colors.

```ts
// Create a PaletteRGB from a Swatch
const redPalette = PaletteRGB.from(red):
```
