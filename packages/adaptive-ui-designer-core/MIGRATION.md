# Migration

What changed in the designer core since 0.6, as it moves to the 1.0 beta of `@adaptive-web/adaptive-ui` and the
[design token library](https://github.com/nicholasrice/design-token-library), and what to use instead.

## The token registry

The tokens of the designer are the tokens of a library, so the registry and its lists are removed. The core depends on
`@adaptive-web/adaptive-ui` and not on `@microsoft/fast-foundation`.

| 0.6 | Now |
| --- | --- |
| `DesignTokenRegistry`, `registerTokens`, `registerAppliableTokens` | The tokens of the library the designer works with |
| `AdaptiveDesignToken`, `AdaptiveDesignTokenOrGroup` (a FAST token with its metadata) | A token of the library, whose metadata is in its `$extensions` |
| `registry.find(property)`, the tokens whose `intendedFor` has a style property | Comes with the Figma plugin, which is its first use |
| The list of tokens that can be overridden | Comes with the Figma plugin: the tokens whose value is given, not derived by a recipe or a ref |
