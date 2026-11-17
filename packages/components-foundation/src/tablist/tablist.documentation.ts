import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TablistElement}.
 *
 * @public
 */
export const tablistDocumentation = defineDocumentation({
    id: "tablist",
    definition:
        'A **Tablist** groups tabs (`role="tablist"`). One tab is selected; its panel lives in a separate element referenced by `panels`.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the tablist; the default slot holds tabs only.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction of the tabs and the arrow keys that move between them.",
                enumValues: [
                    { id: "horizontal", description: "Tabs in a row." },
                    { id: "vertical", description: "Tabs in a column." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "The tabs.",
            },
        ],
    },
});
