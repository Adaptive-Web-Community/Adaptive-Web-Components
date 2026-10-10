---
"@adaptive-web/adaptive-ui": patch
---

Fixed `aui compile-styles` failing to format the stylesheet for components with a TypeScript or JavaScript anatomy, which caused prettier to parse the CSS as JavaScript.
