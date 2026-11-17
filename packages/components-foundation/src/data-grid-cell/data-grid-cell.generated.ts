/* eslint-disable */
// This file is generated from src/data-grid-cell/data-grid-cell.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Slot names of Data Grid Cell.
 *
 * @public
 */
export const DataGridCellSlots = {
    /** Cell content. */
    default: "",
} as const;

/**
 * The kind of cell.
 *
 * @public
 */
export const DataGridCellCellType = {
    /** A data cell. */
    default: "default",

    /** A column header. */
    columnHeader: "columnHeader",

    /** A row header. */
    rowHeader: "rowHeader",
} as const;

/** @public */
export type DataGridCellCellType = (typeof DataGridCellCellType)[keyof typeof DataGridCellCellType];

/**
 * A **Data Grid Cell** is one cell in a row.
 *
 * @public
 */
export interface DataGridCellContract {
    /**
     * The kind of cell.
     */
    cellType: DataGridCellCellType;
}
