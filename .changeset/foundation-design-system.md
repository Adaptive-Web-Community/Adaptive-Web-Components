---
"@adaptive-web/components-foundation": minor
"@adaptive-web/components-fast": minor
---

The `DesignSystem` of the components is in the foundation, without a framework: the prefix, the registry, the statics, and the token library, which renders the style rules of a component to CSS (`renderStyles`) and writes the tokens (`adoptTokenStyles`). The FAST components' `DesignSystem` extends it, to define the elements and to assemble their `ElementStyles`. See the foundation's [README](./README.md).
