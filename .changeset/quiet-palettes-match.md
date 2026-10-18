---
"@adaptive-web/adaptive-ui": patch
---

Fix the parity snapshot test of the reference tokens, which evaluated the color recipes of the accent, highlight, critical, warning, success, and info palettes with the neutral palette. This only changes the test and its snapshot, not the package.
