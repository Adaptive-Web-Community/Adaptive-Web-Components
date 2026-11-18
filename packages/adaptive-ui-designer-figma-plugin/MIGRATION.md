# Migrating the Figma plugin to the design token library

What changed in the plugin since 0.x, and why. The decisions behind it are in `docs/decisions/` (0023 and 0024 are specific to the plugin).

## The evaluator

The plugin no longer mirrors the Figma node tree in the DOM and reads computed styles from it. Each node gets a library that extends its parent's library, and the node's overrides are set on it
in this order: inherited, ref, local. `color.context` is set from the parent's fill, so a node evaluates against what is behind it. Evaluated values are never stored; only the override strings are.

| 0.x | Now |
| --- | --- |
| FAST `DesignToken`s, a DOM element per node | `evaluateNodes(nodes)` in `src/ui/tokens/evaluator.ts` over `Library.extend()` |
| `fast-foundation` components in the UI | `@adaptive-web/components-fast` 0.10 (`adaptive-tablist`, `adaptive-switch`, ...) |
| `StyleModules` | Treatments, applied by their path (`appliedTreatments: string[]`) |
| `StyleNameMapping` | Token paths, resolved by `resolveTokenName`; old stored names still resolve |
| `Map`s in node data | Plain records |
| `getAppliedStyleModulesRawData` | `getAppliedTreatmentsRawData`, falling back on the former key |

## Tokens

- A token is offered for the style properties in its `intendedFor`, or else for all that its `$type` can be (decision 0023). `intendedFor` narrows and is optional.
- The designer overrides the *given* tokens, those that are configured and not computed (decision 0024). An override is a string, parsed by the token's `$type` in `src/ui/tokens/values.ts`.
- Messages between the UI and the Figma sandbox are plain JSON (a DTCG color, `{value, unit}` dimensions, DTCG shadow layers). The sandbox converts them in `src/figma/values.ts`.

## Code generation

`CodeGen` is created with a token name index and writes from `SerializableAnatomy` (`anatomyOf` in designer-figma):

```ts
const codeGen = new CodeGen(names);
codeGen.generateAnatomyCode(anatomy);
codeGen.generateStylesCode(anatomy);
```

Treatments and tokens are written as `tokens.<path>`, a value on a fill as `onFill(...)`, and a condition as an `Anatomy.conditions` selector. A treatment that isn't known is written as a comment.

## Known differences

- The `appearance` attribute of `adaptive-button` has no styles in 1.0, so the plugin's buttons use the default treatment.
- The glyph of a treatment previews the rest state only.
- `null` for a state removes it on the node (`STYLE_REMOVE`); an absent state falls through to `rest`.
