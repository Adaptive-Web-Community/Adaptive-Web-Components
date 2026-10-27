import type { ValuesOf } from "../utilities/typings.js";

/**
 * The kind of a {@link MenuItemElement}: an item that does something, or one that is checked, alone or as one of a group.
 *
 * @public
 */
export const MenuItemType = {
    /** An item that does something, or opens its submenu (`role="menuitem"`). */
    item: "item",

    /** An item that is checked or not (`role="menuitemcheckbox"`). */
    checkbox: "checkbox",

    /** An item of a group of which one is checked (`role="menuitemradio"`): the radio items next to each other in a menu. */
    radio: "radio",
} as const;

/**
 * The kind of a {@link MenuItemElement}.
 *
 * @public
 */
export type MenuItemType = ValuesOf<typeof MenuItemType>;

/**
 * The number of columns before the content of a {@link MenuItemElement}, which its menu gives so the contents of its items line up: one for
 * the indicators of checkbox and radio items, and one for `start` content.
 *
 * @public
 */
export type MenuItemStartColumns = 0 | 1 | 2;

/**
 * The parts of a {@link MenuItemElement}.
 *
 * @public
 */
export const MenuItemParts = {
    /** The indicator of a checkbox or radio item, shown when it is checked. */
    indicator: "indicator",

    /** The container of the default slot. */
    content: "content",

    /** The icon of an item that has a submenu. */
    submenuIcon: "submenu-icon",
} as const;

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
export interface MenuItemElement extends HTMLElement {
    /**
     * Its kind.
     *
     * @remarks
     * HTML attribute: `type`. The default is `item`.
     */
    type: MenuItemType;

    /**
     * Whether a checkbox or radio item is checked.
     *
     * @remarks
     * HTML attribute: `checked`.
     */
    checked: boolean;

    /**
     * Whether it is disabled: it stays focusable, and can't be activated.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * The menu in its `submenu` slot, which it opens, or `null`.
     */
    submenu: HTMLElement | null;

    /**
     * The number of columns before its content, given by its menu.
     */
    startColumns: MenuItemStartColumns;
}
