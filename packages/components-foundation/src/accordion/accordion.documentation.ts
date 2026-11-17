import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link AccordionElement}.
 *
 * @public
 */
export const accordionDocumentation = defineDocumentation({
    id: "accordion",
    definition:
        "An **Accordion** is a set of expandable sections. Each item has a heading button and a collapsible panel.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host holds accordion items in the default slot.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "expandMode",
                kind: ContractPropertyKind.enum,
                description: "Whether one item or several can be expanded at a time.",
                enumValues: [
                    { id: "single", description: "One item expanded; it can't be collapsed except by expanding another." },
                    { id: "multi", description: "Any number of items can be expanded." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "Accordion items.",
            },
        ],
    },
});
