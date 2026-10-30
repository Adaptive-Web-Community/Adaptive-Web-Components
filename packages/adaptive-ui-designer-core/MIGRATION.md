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

## Names stored on a node

A node stores the names of the tokens set to it, of the tokens applied to its style, and of the treatments (style modules)
applied to it. They're read by the current name of each, which the library's names find from any name the token had, as
`@adaptive-web/adaptive-ui` keeps them ([decision 0014](../../docs/decisions/0014-a-names-history-is-kept-with-what-it-names.md)).
A node saved by 0.6 reads as it was, and is saved with the current names. A name that finds no token is kept as it is.

| 0.6 | Now |
| --- | --- |
| `TokenNameMapping` of `@adaptive-web/adaptive-ui/reference`, for the tokens only | `PluginNode.tokenNames`, which the design tool sets to `tokenNames(library)` before it reads a node, for the tokens and the treatments |
| `accent-fill-readable`, an interactive token group | `color.accent.fill.readable`, an interactive token |
| `neutral-fill-stealth-rest`, a token of the group | `color.neutral.fill.stealth.rest`, a state of the interactive token |
| `color.accent-fill-readable-control`, a style module | `color.accent.treatments.fillReadableControl`, a treatment token |

## Plain data

What a node stores and what the plugin passes between its UI and the design tool are plain objects and arrays, so they are
JSON as they are. A node stores the same JSON as 0.6, an object by name, and the forms of a `Map` that earlier versions
stored are still read.

| 0.6 | Now |
| --- | --- |
| `DesignTokenValues`, `AppliedDesignTokens`, `AppliedStyleValues`, `AdditionalData`, which extended `Map` | Records: `tokens[name]`, `Object.entries(tokens)`, `Object.keys(tokens).length` for `size` |
| `AppliedStyleModules`, which extended `Array` | `string[]` |
| `Config`, `DesignTokenValue`, `AppliedDesignToken`, `AppliedStyleValue`, classes with a constructor | Interfaces: `{ value }`, `{ tokenID }` |
| `deserializeMap(json)`, which returned a `Map` of any value | `deserializeRecord(json, isValue)`, which keeps the values a guard accepts (`isDesignTokenValue`, `isAppliedDesignToken`) and warns about the others |
| `serializeMap(map)` | `JSON.stringify(record)` |
| `mapReplacer`, `mapReviver`, which tagged a `Map` in a message between the UI and the design tool | Nothing: a message is plain data, and `JSON.stringify` and `JSON.parse` take it as it is |
