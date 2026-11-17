import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link DividerElement}.
 *
 * @public
 */
export const dividerDocumentation = defineDocumentation({
    id: "divider",
    definition:
        'A **Divider** is a line that separates content (`role="separator"`). Authors may set `role="presentation"` for decoration only.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the separator; the default slot is optional content.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction of the line.",
                enumValues: [
                    { id: "horizontal", description: "A horizontal rule." },
                    { id: "vertical", description: "A vertical rule." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "Optional content in the divider.",
            },
        ],
    },
});
