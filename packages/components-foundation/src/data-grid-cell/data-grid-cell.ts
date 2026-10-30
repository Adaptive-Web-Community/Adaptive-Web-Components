import type { DefaultAria } from "../utilities/aria.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * The kind of a {@link DataGridCellElement}.
 *
 * @public
 */
export const DataGridCellType = {
    /** A cell of data (`role="gridcell"`). */
    default: "default",

    /** The header of a column (`role="columnheader"`). */
    columnHeader: "columnheader",

    /** The header of a row (`role="rowheader"`). */
    rowHeader: "rowheader",
} as const;

/**
 * The kind of a {@link DataGridCellElement}.
 *
 * @public
 */
export type DataGridCellType = ValuesOf<typeof DataGridCellType>;

/**
 * A cell of a data grid's row.
 *
 * @remarks
 * The host is the cell, and takes focus; its grid owns its `tabindex`. Enter or F2 moves the focus into its content, and Escape back.
 *
 * Slots: the default slot for its content.
 *
 * @public
 */
export interface DataGridCellElement extends HTMLElement {
    /**
     * Its kind.
     *
     * @remarks
     * HTML attribute: `cell-type`. The default is `default`.
     */
    cellType: DataGridCellType;
}

/**
 * The default ARIA of a data grid cell: the role of its kind.
 *
 * @public
 */
export function dataGridCellAria(cell: DataGridCellElement): DefaultAria {
    return { role: cell.cellType === DataGridCellType.default ? "gridcell" : cell.cellType };
}
