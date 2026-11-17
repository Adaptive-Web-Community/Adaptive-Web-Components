import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link AccordionItemElement}.
 *
 * @public
 */
export const accordionItemDocumentation = defineDocumentation({
    id: "accordionItem",
    definition:
        "An **Accordion Item** is a heading with a button that expands and collapses a content panel.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The `heading` part contains the expand button, optional slots, and icon; `panel` holds the region.",
        parts: {
            heading: {
                description: "The heading row with the button, slots, and icon.",
            },
            button: {
                description: "The native button that expands and collapses the panel.",
                interactive: true,
            },
            headingContent: {
                description: "Content from the `heading` slot inside the button.",
            },
            icon: {
                description: "Collapsed and expanded icons.",
            },
            panel: {
                description: "The region controlled by the button, hidden when collapsed.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "headingLevel",
                kind: ContractPropertyKind.number,
                description: "The level of the heading (`aria-level`). The default is 2.",
            },
            {
                id: "expanded",
                kind: ContractPropertyKind.boolean,
                description: "Whether the panel is shown.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description: "Whether the item can't be expanded or collapsed.",
            },
            {
                id: "collapsible",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether the user can collapse the item when it is expanded. The accordion may set this to `false` in single-expand mode.",
            },
        ],
        slots: [
            {
                id: "heading",
                description: "Label content inside the expand button.",
            },
            {
                id: "default",
                description: "Panel content.",
            },
            {
                id: "start",
                description: "Optional content after the button in the heading row.",
            },
            {
                id: "end",
                description: "Optional content after `start` in the heading row.",
            },
            {
                id: "collapsed-icon",
                description: "Replaces the default collapsed icon.",
            },
            {
                id: "expanded-icon",
                description: "Replaces the default expanded icon.",
            },
        ],
    },
});
