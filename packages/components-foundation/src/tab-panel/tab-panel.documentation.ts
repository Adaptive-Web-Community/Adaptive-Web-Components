import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TabPanelElement}.
 *
 * @public
 */
export const tabPanelDocumentation = defineDocumentation({
    id: "tabPanel",
    definition:
        'A **Tab Panel** is the content for a tab (`role="tabpanel"`), named by its tab and hidden when the tab is not selected.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the panel; the default slot is its content.",
        parts: {},
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "The panel content.",
            },
        ],
    },
});
