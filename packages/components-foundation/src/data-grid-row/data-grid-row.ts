import type { DataGridCellElement } from "../data-grid-cell/data-grid-cell.js";
import type { DefaultAria } from "../utilities/aria.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * The kind of a {@link DataGridRowElement}.
 *
 * @public
 */
export const DataGridRowType = {
    /** A row of data, which can be selected. */
    default: "default",

    /** A row of headers. */
    header: "header",

    /** A row of headers that stays at the top as the grid scrolls. */
    stickyHeader: "sticky-header",
} as const;

/**
 * The kind of a {@link DataGridRowElement}.
 *
 * @public
 */
export type DataGridRowType = ValuesOf<typeof DataGridRowType>;

/**
 * A row of a data grid (`role="row"`), whose cells are laid out in the grid's columns.
 *
 * @remarks
 * Slots: the default slot for its cells.
 *
 * Events: `change` when the user selects or unselects it, which bubbles.
 *
 * @public
 */
export interface DataGridRowElement extends HTMLElement {
    /**
     * Its kind.
     *
     * @remarks
     * HTML attribute: `row-type`. The default is `default`.
     */
    rowType: DataGridRowType;

    /**
     * Whether it is selected.
     *
     * @remarks
     * HTML attribute: `selected`.
     */
    selected: boolean;

    /**
     * Whether its grid selects rows, given by the grid.
     */
    selectable: boolean;

    /**
     * Its cells, in order: those in its slot, and those its binding renders.
     */
    readonly cells: readonly DataGridCellElement[];
}

/**
 * The default ARIA of a data grid row: the `row` role, and whether it is selected when its grid selects rows.
 *
 * @public
 */
export function dataGridRowAria(row: DataGridRowElement): DefaultAria {
    return { role: "row", ariaSelected: row.selectable && row.rowType === DataGridRowType.default ? `${row.selected}` : null };
}
