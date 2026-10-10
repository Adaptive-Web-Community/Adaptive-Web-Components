---
"@adaptive-web/adaptive-ui": patch
---

Fixed several issues found while improving test coverage of `core`:
- `Shadow` now writes a zero blur radius when a spread is set.
- `Styles` keeps property values of `0`, and `Styles.compose` no longer modifies the array it is given.
- `convertStylesToFocusState` keeps number and zero values.
- `ElementStylesRenderer.render` no longer accumulates rules between calls.
- `BasePalette.get` rounds a fractional index.
- `PaletteRGB` no longer throws with a larger `stepContrast`, and `preserveSource` keeps the source color and no longer duplicates a black or white source.
