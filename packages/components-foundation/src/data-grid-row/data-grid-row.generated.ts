/* eslint-disable */
// This file is generated from src/data-grid-row/data-grid-row.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Data Grid Row.
 *
 * @public
 */
export const DataGridRowSlots = {
    /** Cells of the row. */
    default: "",
} as const;

/**
 * The kind of row.
 *
 * @public
 */
export const DataGridRowRowType = {
    /** A data row that can be selected. */
    default: "default",

    /** A header row. */
    header: "header",

    /** A header row that stays at the top while scrolling. */
    stickyHeader: "stickyHeader",
} as const;

/** @public */
export type DataGridRowRowType = (typeof DataGridRowRowType)[keyof typeof DataGridRowRowType];

/**
 * A **Data Grid Row** (`role="row"`) holds cells laid out in the grid's columns.
 *
 * @public
 */
export interface DataGridRowContract {
    /**
     * The kind of row.
     */
    rowType: DataGridRowRowType;

    /**
     * Whether it is selected.
     */
    selected: boolean;
}
