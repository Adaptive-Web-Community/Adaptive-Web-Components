import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for the badge reference.
 *
 * @public
 */
export const badgeDocumentation = defineDocumentation({
    id: "badge",
    definition: "A **Badge** is a short label, such as a count or status, with optional `start` and `end` content.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the badge; the default slot is the main label in the `content` part.",
        parts: {
            content: {
                description: "The default slot label between optional `start` and `end` slots.",
            },
        },
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "The badge text or icon.",
            },
            {
                id: "start",
                description: "Optional content before the label.",
            },
            {
                id: "end",
                description: "Optional content after the label.",
            },
        ],
    },
});
