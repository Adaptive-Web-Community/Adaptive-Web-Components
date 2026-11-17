import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link DataGridRowElement}.
 *
 * @public
 */
export const dataGridRowDocumentation = defineDocumentation({
    id: "dataGridRow",
    definition: "A **Data Grid Row** (`role=\"row\"`) holds cells laid out in the grid's columns.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Generated and slotted cells share a row container.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "rowType",
                kind: ContractPropertyKind.enum,
                description: "The kind of row.",
                enumValues: [
                    { id: "default", description: "A data row that can be selected." },
                    { id: "header", description: "A header row." },
                    { id: "stickyHeader", description: "A header row that stays at the top while scrolling." },
                ],
            },
            {
                id: "selected",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is selected.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "Cells of the row.",
            },
        ],
    },
});
