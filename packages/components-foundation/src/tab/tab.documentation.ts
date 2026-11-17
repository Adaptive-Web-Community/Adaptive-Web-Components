import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TabElement}.
 *
 * @public
 */
export const tabDocumentation = defineDocumentation({
    id: "tab",
    definition:
        'A **Tab** is one label in a tablist (`role="tab"`). When selected, its paired tab panel is shown.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the tab and receives focus; label content lives in the `content` part.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            content: {
                description: "The default slot label between optional `start` and `end` slots.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "selected",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is selected and its panel is shown.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled: it stays focusable, as ARIA practices ask of tabs, and can't be selected.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The tab label.",
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
