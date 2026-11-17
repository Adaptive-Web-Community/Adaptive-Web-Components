import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link ListItemElement}.
 *
 * @public
 */
export const listItemDocumentation = defineDocumentation({
    id: "listItem",
    definition: 'A **List Item** is one entry in a list (`role="listitem"`).',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the item; the default slot is its content.",
        parts: {},
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "Item content.",
            },
        ],
    },
});
