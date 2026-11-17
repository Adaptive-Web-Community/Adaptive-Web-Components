import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link MenuItemElement}.
 *
 * @public
 */
export const menuItemDocumentation = defineDocumentation({
    id: "menuItem",
    definition:
        'A **Menu Item** is an entry in a menu: one that does something, a checkbox, a radio, or one that opens a submenu (`role="menuitem"`, `menuitemcheckbox`, or `menuitemradio`).',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description:
            "The host is the item; checkbox and radio kinds show an indicator part; a submenu part holds the nested menu.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            indicator: {
                description: "The checked glyph of a checkbox or radio item, hidden for plain items.",
            },
            content: {
                description: "The default slot label and optional `start` and `end` slots.",
            },
            submenuIcon: {
                description: "The icon shown when the item has a submenu.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "type",
                kind: ContractPropertyKind.enum,
                description: "Whether the item does something, toggles checked, or is one of a radio group.",
                enumValues: [
                    { id: "item", description: 'Plain item (`role="menuitem"`).' },
                    { id: "checkbox", description: 'Checkbox item (`role="menuitemcheckbox"`).' },
                    { id: "radio", description: 'Radio item (`role="menuitemradio"`).' },
                ],
            },
            {
                id: "checked",
                kind: ContractPropertyKind.boolean,
                description: "Whether a checkbox or radio item is checked.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is disabled: it stays focusable, and can't be activated.",
            },
            {
                id: "expanded",
                kind: ContractPropertyKind.boolean,
                description: "Whether its submenu popover is open.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The item label.",
            },
            {
                id: "start",
                description: "Optional content before the label.",
            },
            {
                id: "end",
                description: "Optional content after the label.",
            },
            {
                id: "submenu",
                description: "The nested menu popover, when the item opens a submenu.",
            },
            {
                id: "checkbox-indicator",
                description: "Replaces the default checkbox indicator.",
            },
            {
                id: "radio-indicator",
                description: "Replaces the default radio indicator.",
            },
            {
                id: "submenu-icon",
                description: "Replaces the default submenu icon.",
            },
        ],
    },
});
