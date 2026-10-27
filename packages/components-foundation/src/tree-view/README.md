# Tree View and Tree Item

A tree view (`role="tree"`) is a hierarchy of tree items, which the user expands and collapses, and of which one is selected: the
[ARIA tree view pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/).

- Contract: `TreeViewElement` (`tree-view.ts`), `TreeItemElement`, `TreeItemParts`, `treeItemAria`, `placeTreeItems`, `toggleTreeItem`, and
  `selectTreeItem` (`../tree-item/tree-item.ts`).
- Behavior: `TreeViewController` (`tree-view.controller.ts`), with the `RovingFocusController` over the items that are shown, and the
  functions of the item: it expands and collapses itself with its button, and puts its items in its `item` slot.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Roles | `role="treeitem"` and the ARIA attributes written to the host; a `role="group"` around the items | `ElementInternals` (`treeitem`, `aria-selected`, `aria-disabled`, and `aria-expanded` when it has items); the `items` part is the `role="group"`. The browser works out the levels |
| Nested items | The item sets `slot="item"` on itself when its parent is an item | The parent puts its child items in its `item` slot (`placeTreeItems`): the slot is the parent's |
| Tab order | The tree host is focusable, and moves the focus to the selected item, or the first | The `RovingFocusController`: the selected item, or the first, or the last focused |
| Keys | Up and Down between the items shown, Home, End, Right and Left to expand, collapse, and move to the first item and the parent; Enter toggles the selection | The ARIA pattern: Up and Down between the items shown, without wrapping, Home, End; Right expands, then moves to the first item; Left collapses, then moves to the parent; Enter selects |
| Selection | One item; a click toggles it | One item, `selected`, reflected: a click or Enter selects it, and emits `change`; the button expands and collapses without selecting |
| Expansion | `expanded`, by the button or Right and Left; `expanded-change` | `expanded`, reflected, by the button or Right and Left; `toggle`, which bubbles, as a `<details>`' |
| Disabled items | `disabled`, `aria-disabled` | Focusable, as the ARIA practices ask of tree items, and not selected, expanded, or collapsed |
| Items that change | `slotted` and `children` | The tree observes the items under it, and their `expanded` and `selected` attributes, so an item selected by code unselects the others |
| Indentation | `nested`, given by the tree | `nested`, given by the tree to every item when an item has items, shown as `:state(nested)` |

Considered and not taken:

- Multiple selection (`aria-multiselectable`): add it on the first real use.
- Typing to move to an item that starts with it, and `*` to expand the siblings, which the ARIA pattern has as optional.
- Space to select: the ARIA pattern has Space for multiple selection; Enter selects here.
