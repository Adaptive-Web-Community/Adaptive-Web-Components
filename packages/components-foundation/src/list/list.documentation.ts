import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link ListElement}.
 *
 * @public
 */
export const listDocumentation = defineDocumentation({
    id: "list",
    definition:
        'A **List** is a static group of items (`role="list"`). Keyboard focus reaches items through their own controls, not arrow-key roving.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the list; items are in the default slot.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "Layout direction only; a list has no `aria-orientation`.",
                enumValues: [
                    { id: "horizontal", description: "Items in a row." },
                    { id: "vertical", description: "Items in a column." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "List items.",
            },
        ],
    },
});
