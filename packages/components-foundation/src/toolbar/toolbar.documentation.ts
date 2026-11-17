import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link ToolbarElement}.
 *
 * @public
 */
export const toolbarDocumentation = defineDocumentation({
    id: "toolbar",
    definition:
        'A **Toolbar** groups controls (`role="toolbar"`). Arrow keys move focus between items; one item is in the tab order at a time.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Optional `label` slot names the toolbar; items live in `positioningRegion`.",
        parts: {
            positioningRegion: {
                description: "The container of the toolbar items, laid out in `orientation`.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction in which the items are laid out, and the arrow keys that move between them.",
                enumValues: [
                    { id: "horizontal", description: "Items in a row." },
                    { id: "vertical", description: "Items in a column." },
                ],
            },
        ],
        slots: [
            {
                id: "label",
                description: "Optional label that names the toolbar.",
            },
            {
                id: "default",
                description: "The toolbar items.",
            },
            {
                id: "start",
                description: "Optional items before the default slot items.",
            },
            {
                id: "end",
                description: "Optional items after the default slot items.",
            },
        ],
    },
});
