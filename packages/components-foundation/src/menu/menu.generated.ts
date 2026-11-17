/* eslint-disable */
// This file is generated from src/menu/menu.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Menu.
 *
 * @public
 */
export const MenuSlots = {
    /** Menu items and dividers between them. */
    default: "",
} as const;

/**
 * A **Menu** is a list of menu items (`role="menu"`), which the arrow keys move between. It is often a popover opened by a button, or a submenu in a menu item's `submenu` slot.
 *
 * @public
 */
export interface MenuContract {
    /**
     * Whether this menu is assigned to a menu item's `submenu` slot (`slot="submenu"`), not a control attribute.
     */
    submenu: boolean;
}
