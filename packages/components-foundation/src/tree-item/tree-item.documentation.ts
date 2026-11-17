import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TreeItemElement}.
 *
 * @public
 */
export const treeItemDocumentation = defineDocumentation({
    id: "treeItem",
    definition:
        'A **Tree Item** is one node in a tree (`role="treeitem"`), which can have child items in a collapsible group.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The row is the `control` part; child items live in the `items` group.",
        parts: {
            control: {
                description: "The row: expand button, optional `start` and `end`, and the label.",
                interactive: true,
                indicatesFocus: true,
                parts: {
                    expandCollapseButton: {
                        description: "Expands or collapses an item that has children; hidden when it has none.",
                    },
                    content: {
                        description: "The default slot label.",
                    },
                },
            },
            items: {
                description: "The child items (`role=\"group\"`), hidden while collapsed.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "expanded",
                kind: ContractPropertyKind.boolean,
                description: "Whether its child items are shown.",
            },
            {
                id: "selected",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is selected.",
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is disabled: it stays focusable but can't be selected or toggled.",
            },
            {
                id: "nested",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether its tree has items with children, set by the tree so rows align.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "The item label.",
            },
            {
                id: "start",
                description: "Optional content before the label.",
            },
            {
                id: "end",
                description: "Optional content after the label.",
            },
            {
                id: "item",
                description: "Child tree items.",
            },
            {
                id: "expandCollapseIcon",
                description: "Icon in the expand/collapse button.",
            },
        ],
    },
});
