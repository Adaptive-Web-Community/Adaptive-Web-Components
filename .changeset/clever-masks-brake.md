---
"@adaptive-web/adaptive-web-components": minor
"@adaptive-web/adaptive-ui": minor
"@adaptive-web/adaptive-ui-designer-core": patch
"@adaptive-web/adaptive-ui-designer-figma": patch
---

Remove deprecated public APIs, the `adaptive-ui/migration` export, the `Swatch` class (use `Color`), and per-state color token aliases. Internal packages now use `ColorSet` properties, `controlListDensityStyles`, `densityControlList`, and `Color.toString()`.
