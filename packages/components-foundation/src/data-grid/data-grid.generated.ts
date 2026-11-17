/* eslint-disable */
// This file is generated from src/data-grid/data-grid.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Data Grid for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const DataGridParts = {
    /** The container of header, generated, and slotted rows. */
    rows: "rows",
} as const;

/**
 * Slot names of Data Grid.
 *
 * @public
 */
export const DataGridSlots = {
    /** Data grid rows. */
    default: "",
} as const;

/**
 * Whether rows are selected, one or several.
 *
 * @public
 */
export const DataGridSelectionMode = {
    /** No selection. */
    none: "none",

    /** One row at a time. */
    singleRow: "singleRow",

    /** Any number of rows. */
    multiRow: "multiRow",
} as const;

/** @public */
export type DataGridSelectionMode = (typeof DataGridSelectionMode)[keyof typeof DataGridSelectionMode];

/**
 * A **Data Grid** is tabular data (`role="grid"`): rows of cells moved with the keys, with optional row selection.
 *
 * @public
 */
export interface DataGridContract {
    /**
     * Whether rows are selected, one or several.
     */
    selectionMode: DataGridSelectionMode;

    /**
     * Column layout as CSS `grid-template-columns`, or null for equal columns.
     */
    gridTemplateColumns: string | null;
}
