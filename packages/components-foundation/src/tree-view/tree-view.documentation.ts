import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link TreeViewElement}.
 *
 * @public
 */
export const treeViewDocumentation = defineDocumentation({
    id: "treeView",
    definition:
        'A **Tree View** is a hierarchy of tree items (`role="tree"`): one item is selected, and items expand and collapse.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the tree; items are in the default slot.",
        parts: {},
    },
    contract: {
        properties: [],
        slots: [
            {
                id: "default",
                description: "Tree items.",
            },
        ],
    },
});
