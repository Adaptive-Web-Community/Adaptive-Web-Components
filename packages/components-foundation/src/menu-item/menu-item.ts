import type { MenuItemContract } from "./menu-item.generated.js";

/**
 * The number of columns before the content of a {@link MenuItemElement}, which its menu gives so the contents of its items line up: one for
 * the indicators of checkbox and radio items, and one for `start` content.
 *
 * @public
 */
export type MenuItemStartColumns = 0 | 1 | 2;

/**
 * An item of a menu: one that does something, a checkbox, or a radio, or one that opens a submenu. Implements the item of the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/menubar/ | ARIA menu pattern} with {@link MenuItemController}.
 *
 * @remarks
 * The host is the item, and takes focus; its menu owns its `tabindex`. A disabled item stays focusable, as the ARIA practices ask of menu
 * items, and can't be activated. Clicking it, Enter, and Space activate it: a checkbox toggles, a radio is checked, and an item with a
 * submenu opens it, as Right does. The submenu is a menu in the `submenu` slot, a popover anchored to the item.
 *
 * Slots: the default slot for its label, `start` and `end`, and `submenu`.
 *
 * Events: `click` when it is activated, and `change` when the user checks or unchecks it.
 *
 * @public
 */
export interface MenuItemElement extends HTMLElement, MenuItemContract {
    /**
     * The menu in its `submenu` slot, which it opens, or `null`.
     */
    submenu: HTMLElement | null;

    /**
     * The number of columns before its content, given by its menu.
     */
    startColumns: MenuItemStartColumns;
}
