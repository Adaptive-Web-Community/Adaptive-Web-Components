# Menu and Menu Item

A menu (`role="menu"`) has items that do something, checkbox and radio items, and items that open a submenu: the
[ARIA menu pattern](https://www.w3.org/WAI/ARIA/apg/patterns/menubar/), opened by a menu button.

- Contract: `MenuElement` (`menu.ts`), `MenuItemElement`, `MenuItemType`, `MenuItemStartColumns`, and `MenuItemParts`
  (`../menu-item/menu-item.ts`).
- Behavior: `MenuController` (`menu.controller.ts`), with the `RovingFocusController`, and `MenuItemController`
  (`../menu-item/menu-item.controller.ts`), with the `SpacePressController`.

A menu that opens is a popover. The author gives it `popover`, and a button opens it with `commandfor` (the Invoker Commands API), which
makes the button its anchor, and gives the button `aria-expanded`; the author gives the button `aria-haspopup="menu"`, since it doesn't know
what it opens. A submenu is a menu in an item's `submenu` slot, which the item makes a popover anchored to it.

## What was taken from where

The source: FAST Foundation 3.0.0-alpha.33 (the archive).

| Aspect | FAST Foundation | Here |
| --- | --- | --- |
| Opening | Not the menu's: it was shown inline, or in an anchored region | A popover the author marks, opened by any invoker (a Button's `commandfor`); a menu without `popover` is inline |
| Placement | Submenus by Floating UI | CSS anchor positioning: below the button, flipped above; a submenu after its item, flipped before |
| Item kinds | The `role` attribute: `menuitem`, `menuitemcheckbox`, `menuitemradio` | A `type` attribute, as the old HTML `<menuitem type>`: `item`, `checkbox`, `radio`, mapped to the role through `ElementInternals` |
| Radio groups | The radio items between other elements | The same: the radio items next to each other, so a divider separates two groups |
| Focus on opening | `focus()` of the menu focuses its first item | The first item, when the popover opens; when it closes with the focus in it, the focus goes back to what opened it: the button, or the item of a submenu |
| Keys | Up, Down, Home, End, without wrapping; Enter and Space activate; Right opens a submenu, Left and Escape close it | The same, wrapping, with Space when it is released, as a button's; Tab closes the menus; Escape closes the menu it is in (the popover's close request) |
| Disabled items | `disabled`, `aria-disabled`, still focusable | The same, as the ARIA practices ask of menu items: the arrows reach them, and they can't be activated: their click reaches neither the author nor the menu |
| Activating an item | `change` on the item | `click`, by the pointer, Enter, or Space, which closes every menu it is in; a checkbox or radio emits `change` and keeps the menu open |
| Pointer | Hover opens a submenu | Hover focuses the item, as the arrows do, and opens its submenu |
| Columns | AWC gave each item `start-column-count`, so their contents line up | The menu gives each item `startColumns` (a column for the indicators of checkable items, one for `start` content), shown as `:state(start-columns-1)` and `:state(start-columns-2)` |
| Indicators | A slot per role, by template | One `indicator` part, with the design system's checkbox or radio icon, `aria-hidden` |

Considered and not taken:

- Typing a letter to move to the item that starts with it, which the ARIA pattern has as optional: add it on the first real use.
- A menubar: add it when one is needed.
- Items that are links: a menu item with `href` that wraps a native `<a>`, as the Anchor does, when one is needed.
- Down and Up on the menu button, to open the menu at its first or last item, which the ARIA pattern has as optional.
