import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link MenuElement}.
 *
 * @public
 */
export const menuDocumentation = defineDocumentation({
    id: "menu",
    definition:
        'A **Menu** is a list of menu items (`role="menu"`), which the arrow keys move between. It is often a popover opened by a button, or a submenu in a menu item\'s `submenu` slot.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the menu; the default slot holds items and dividers.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "submenu",
                kind: ContractPropertyKind.boolean,
                description:
                    'Whether this menu is assigned to a menu item\'s `submenu` slot (`slot="submenu"`), not a control attribute.',
            },
        ],
        slots: [
            {
                id: "default",
                description: "Menu items and dividers between them.",
            },
        ],
    },
});
