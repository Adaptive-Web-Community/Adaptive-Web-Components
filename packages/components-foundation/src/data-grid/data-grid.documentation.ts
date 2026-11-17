import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link DataGridElement}.
 *
 * @public
 */
export const dataGridDocumentation = defineDocumentation({
    id: "dataGrid",
    definition:
        'A **Data Grid** is tabular data (`role="grid"`): rows of cells moved with the keys, with optional row selection.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "Rows are in the `rows` container; columns follow `--data-grid-template-columns`.",
        parts: {
            rows: {
                description: "The container of header, generated, and slotted rows.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "selectionMode",
                kind: ContractPropertyKind.enum,
                description: "Whether rows are selected, one or several.",
                enumValues: [
                    { id: "none", description: "No selection." },
                    { id: "singleRow", description: "One row at a time." },
                    { id: "multiRow", description: "Any number of rows." },
                ],
            },
            {
                id: "gridTemplateColumns",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "Column layout as CSS `grid-template-columns`, or null for equal columns.",
            },
        ],
        slots: [
            {
                id: "default",
                description: "Data grid rows.",
            },
        ],
    },
});
