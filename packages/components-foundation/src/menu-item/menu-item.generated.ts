/* eslint-disable */
// This file is generated from src/menu-item/menu-item.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Menu Item for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const MenuItemParts = {
    /** The checked glyph of a checkbox or radio item, hidden for plain items. */
    indicator: "indicator",

    /** The default slot label and optional `start` and `end` slots. */
    content: "content",

    /** The icon shown when the item has a submenu. */
    submenuIcon: "submenu-icon",
} as const;

/**
 * Slot names of Menu Item.
 *
 * @public
 */
export const MenuItemSlots = {
    /** The item label. */
    default: "",

    /** Optional content before the label. */
    start: "start",

    /** Optional content after the label. */
    end: "end",

    /** The nested menu popover, when the item opens a submenu. */
    submenu: "submenu",

    /** Replaces the default checkbox indicator. */
    checkboxIndicator: "checkbox-indicator",

    /** Replaces the default radio indicator. */
    radioIndicator: "radio-indicator",

    /** Replaces the default submenu icon. */
    submenuIcon: "submenu-icon",
} as const;

/**
 * Whether the item does something, toggles checked, or is one of a radio group.
 *
 * @public
 */
export const MenuItemType = {
    /** Plain item (`role="menuitem"`). */
    item: "item",

    /** Checkbox item (`role="menuitemcheckbox"`). */
    checkbox: "checkbox",

    /** Radio item (`role="menuitemradio"`). */
    radio: "radio",
} as const;

/** @public */
export type MenuItemType = (typeof MenuItemType)[keyof typeof MenuItemType];

/**
 * A **Menu Item** is an entry in a menu: one that does something, a checkbox, a radio, or one that opens a submenu (`role="menuitem"`, `menuitemcheckbox`, or `menuitemradio`).
 *
 * @public
 */
export interface MenuItemContract {
    /**
     * Whether the item does something, toggles checked, or is one of a radio group.
     */
    type: MenuItemType;

    /**
     * Whether a checkbox or radio item is checked.
     */
    checked: boolean;

    /**
     * Whether it is disabled: it stays focusable, and can't be activated.
     */
    disabled: boolean;

    /**
     * Whether its submenu popover is open.
     */
    expanded: boolean;
}
