# Adaptive UI Color Recipes

Color recipes are algorithmic patterns that produce individual or sets of colors from a variety of inputs. Components can apply these recipes to achieve expressive theming options while maintaining color accessability targets.

## Paint
A `Paint` is a representation of a color that has a `relativeLuminance` value and a method to convert to a color string. It is the base type for color design tokens.

## Color
A `Color` is an extension of `Paint` for use in a recipe. It adds support for calculating a color as an overlay or transparency
over another `Color`.

**Example: Creating a Color**
```ts
import { Color } from "@adaptive-web/adaptive-ui";

const red = Color.fromRgb(1, 0, 0);
```

## Palette
A palette is a collection `Color` instances, ordered by relative luminance, and provides mechanisms to safely retrieve swatches by index and by target contrast ratios. It also contains a `source` color, which is the color from which the palette is derived.

### PaletteOkhsl
An implementation of `Palette` that uses the okhsl color model, so the steps between its swatches are perceptually equal.

```ts
// Create a PaletteOkhsl from a Color
const redPalette = PaletteOkhsl.from(red);
```
