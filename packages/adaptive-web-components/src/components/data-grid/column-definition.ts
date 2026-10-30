import type { ViewTemplate } from "@microsoft/fast-element";
import type { ValuesOf } from "@adaptive-web/components-foundation";

/**
 * A column of a {@link DataGrid} whose rows are generated from `rowsData`.
 *
 * @public
 */
export interface ColumnDefinition {
    /**
     * The key of the column's value in the data of a row.
     */
    columnDataKey: string;

    /**
     * The text of the column's header, or the key without it.
     */
    title?: string;

    /**
     * The template of the column's header cell, rendered with the cell as its source.
     */
    headerCellTemplate?: ViewTemplate;

    /**
     * The template of the column's cells, rendered with the cell as its source: its `rowData` is the row's data.
     */
    cellTemplate?: ViewTemplate;

    /**
     * Whether the column's cells are the headers of their rows.
     */
    isRowHeader?: boolean;
}

/**
 * Whether a {@link DataGrid} generates a header row from its column definitions.
 *
 * @public
 */
export const GenerateHeaderOptions = {
    /** No header row. */
    none: "none",

    /** A header row. */
    default: "default",

    /** A header row that stays at the top as the grid scrolls. */
    sticky: "sticky",
} as const;

/**
 * Whether a {@link DataGrid} generates a header row.
 *
 * @public
 */
export type GenerateHeaderOptions = ValuesOf<typeof GenerateHeaderOptions>;

/**
 * Columns for the properties of a row's data, in their order.
 *
 * @public
 */
export function generateColumns(row: object): ColumnDefinition[] {
    return Object.getOwnPropertyNames(row).map(columnDataKey => ({ columnDataKey }));
}
