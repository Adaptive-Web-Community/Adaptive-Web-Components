# Migration

What changed in the components since 0.10, as they move from FAST Foundation to `fast-element` 3 and `@adaptive-web/components-foundation`, and what to use
instead. A component that isn't listed hasn't changed yet.

## All components

- The components depend on `@microsoft/fast-element` 3 and `@adaptive-web/components-foundation`, and not on `@microsoft/fast-foundation`. The contract of
  each element (its properties, enumerations, and parts) and its behavior are in the foundation; the element classes and templates are here.
- `compose<Name>(ds, options)` returns a `Promise<FASTElementDefinition>`, since composing a definition is asynchronous in `fast-element` 3.
- `StaticallyComposableHTML` and `staticallyCompose` are this package's, in `utilities/template-helpers.ts`. `ValuesOf` is the components foundation's.

## Accordion

| 0.10 | Now |
| --- | --- |
| `FASTAccordion` (FAST Foundation) | `Accordion` |
| `expandmode` | `expandMode` (the attribute is still `expand-mode`) |
| `AccordionExpandMode` from `@microsoft/fast-foundation` | From `@adaptive-web/components-foundation` |
| The accordion's `change` event, with the active item's id | The item's `change`, which bubbles; its target is the item |
| The accordion sets an `id` on each item | The item's `id` is the author's |

## Accordion Item

| 0.10 | Now |
| --- | --- |
| `FASTAccordionItem` (FAST Foundation) | `AccordionItem` |
| `headinglevel` | `headingLevel` (the attribute is still `heading-level`) |
| The `region` part | `panel`, which has the `hidden` attribute when the item is collapsed |
| `AccordionItemParts` from this package | The foundation's, also exported here |
| An item expands only in an accordion | An item toggles itself, and alone works as a disclosure with a heading |
| The `expandbutton` property | `expandButton`, internal. Use `focus()` to focus the button |
| | `collapsible`, set by the accordion to `false` for the item it keeps expanded in the `single` mode |
