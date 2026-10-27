# Accordion and Accordion Item

An accordion is a list of items, each a heading whose button expands and collapses a panel of content: the
[ARIA accordion pattern](https://www.w3.org/WAI/ARIA/apg/patterns/accordion/).

- Contract: `AccordionElement` and `AccordionExpandMode` (`accordion.ts`), `AccordionItemElement`, `AccordionItemParts`, and `HeadingLevel`
  (`../accordion-item/accordion-item.ts`).
- Behavior: `AccordionController` (keyboard, and one item expanded in the `single` mode), and `toggleAccordionItem` for the click of an item's
  button.
- An item toggles itself, so an item works without an accordion. The accordion reacts when an item's `expanded` changes, by the user or by code,
  which its binding observes and tells the controller.

## What was taken from where

The sources: FAST Foundation 3.0.0-alpha.33 (the archive) and 3.0.0-alpha.31 (what AWC used).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Elements | An accordion and an item, whose heading has a button and whose panel is a region | FAST |
| Heading level | `heading-level`, 2 by default | FAST, as `headingLevel` |
| `aria-controls` and `aria-labelledby` | The item's `id`, generated, and overwritten by the accordion (`accordion-1`) | Fixed ids in the shadow root (`button`, `panel`), and the item's own `id` is the author's |
| Expand modes | `expand-mode`: `single` keeps one item expanded, the first by default; `multi` | FAST, as `expandMode` |
| The expanded item can't be collapsed in `single` | The accordion sets `aria-disabled` on the item's button, reaching into its shadow root (`expandbutton`) | FAST's behavior, through the item's `collapsible` property of the contract |
| What toggles an item | The accordion, on the item's click | The item itself (`toggleAccordionItem`), so it works alone |
| An item expanded by code in `single` | A notifier subscription to each item's `expanded` | FAST: the binding subscribes, and calls `itemExpandedChanged` |
| Keyboard | Up and Down wrap, Home and End | FAST, with `preventDefault` for Home and End. Disabled items are skipped, and a key in a panel or one already handled is ignored |
| Focus of an item | The accordion focuses `expandbutton` | The item's `focus()` focuses its button |
| Events | The accordion's `change`, with the active id | The item's `change`, which bubbles through the accordion, as an input's does |
| Disabled item | `disabled` disables the button, and the item is left out of the keyboard and the `single` mode | The same, except that in `single` a disabled item is collapsed when another is expanded, so one is expanded at a time. It isn't the one expanded by default |
| Collapsed panel | `display: none` in the styles | The `hidden` attribute, which works without styles |
| Icons | `expanded-icon` and `collapsed-icon` slots (alpha.31), one `expand-collapse-icon` slot (alpha.33) | The two slots of alpha.31, which AWC fills from its design system, shown with `hidden` |
| Start and end slots | After the button, for screen readers | FAST |
| An item that isn't defined yet | Not handled: it isn't an item, and isn't again when it is defined | The binding waits for `whenDefined` of the element's name in its registry, and recognizes items by their class |
| The whole heading is clickable | `.button::before` covers the heading | FAST, as a style of the template |

Considered and not taken:

- `hidden="until-found"` on the panel, with `beforematch` expanding the item, so that find in page reaches collapsed content. Worth adding
  where browsers support it; in `single` mode it expands the item that was found.
- `<details name="...">` groups natively, but has no heading semantics and its own keyboard behavior.
- `size`, `marker-position`, and `block` attributes, and `contain: content`: they are appearance, for Adaptive UI.
- Left and Right keys: the ARIA pattern has Up and Down only.
