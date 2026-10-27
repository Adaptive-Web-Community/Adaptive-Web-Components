# List and List Item

A list (`role="list"`) of items (`role="listitem"`), laid out in a column or a row, which scrolls when it overflows in a row. It is static:
the keyboard reaches the items by their own content, in the tab order.

- Contract: `ListElement` and `listAria` (`list.ts`), `ListItemElement` and `listItemAria` (`../list-item/list-item.ts`).
- Behavior: none beyond the roles; the layout and the scrolling are the template's styles.

It is new: it replaces FAST Foundation's Horizontal Scroll and its flippers, which were a row of items with buttons for the mouse to
scroll it.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation's Horizontal Scroll | Here |
| --- | --- | --- |
| Semantics | None: a `div` scroll view, with the items in a slot | `role="list"` and `role="listitem"` through `ElementInternals`. A component instead of a styled `<ul>`, whose list semantics Safari drops with `list-style: none` |
| Orientation | Horizontal only | `orientation`, `vertical` by default, as a list is. It is the layout only: ARIA has no `aria-orientation` for a list |
| Scrolling | Its own: `scroll-items` events, an easing and a duration, and the flippers, which the mouse used, out of the tab order | CSS: the row's overflow scrolls, and scroll snapping is the styles'. The focus scrolls an item into view |
| Keyboard | The flippers weren't focusable; the items were tabbable | The items' content is in the tab order. No roving focus: arrows that move between items make a listbox, a toolbar, or a grid |
| Resize | A `ResizeObserver` to show and hide the flippers | None needed |

Considered and not taken:

- The `::scroll-button()` and `::scroll-marker` pseudo-elements, CSS's own buttons for scrolling: only Chromium has them.
- A carousel: a component of its own, following the [ARIA carousel pattern](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/), when one is
  needed.
- A row whose items have nothing focusable can only be scrolled by the keyboard where the browser makes a scroll container focusable
  (Chromium and Firefox do); to check in Safari.
