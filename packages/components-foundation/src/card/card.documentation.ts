import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link CardElement}.
 *
 * @public
 */
export const cardDocumentation = defineDocumentation({
    id: "card",
    definition:
        "A **Card** is a container for content. It has no behavior; authors choose semantics (`article`, `group`, `region`) when needed.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is a surface; the default slot holds content.",
        parts: {},
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "Card content.",
            },
        ],
    },
});
