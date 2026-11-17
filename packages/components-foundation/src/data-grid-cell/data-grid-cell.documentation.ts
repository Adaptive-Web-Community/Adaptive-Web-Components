import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link DataGridCellElement}.
 *
 * @public
 */
export const dataGridCellDocumentation = defineDocumentation({
    id: "dataGridCell",
    definition: "A **Data Grid Cell** is one cell in a row.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The host is the cell; content is generated or in the default slot.",
        parts: {},
    },
    contract: {
        properties: [
            {
                id: "cellType",
                kind: ContractPropertyKind.enum,
                description: "The kind of cell.",
                enumValues: [
                    { id: "default", description: "A data cell." },
                    { id: "columnHeader", description: "A column header." },
                    { id: "rowHeader", description: "A row header." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "Cell content.",
            },
        ],
    },
});
