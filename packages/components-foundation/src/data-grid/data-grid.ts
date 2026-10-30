import type { DataGridRowElement } from "../data-grid-row/data-grid-row.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * Whether a {@link DataGridElement} selects rows, one or several.
 *
 * @public
 */
export const DataGridSelectionMode = {
    /** No selection. */
    none: "none",

    /** One row at a time. */
    singleRow: "single-row",

    /** Any number of rows. */
    multiRow: "multi-row",
} as const;

/**
 * Whether a {@link DataGridElement} selects rows, one or several.
 *
 * @public
 */
export type DataGridSelectionMode = ValuesOf<typeof DataGridSelectionMode>;

/**
 * The parts of a {@link DataGridElement}.
 *
 * @public
 */
export const DataGridParts = {
    /** The container of the rows, with the `--data-grid-template-columns` custom property, which the rows lay out their cells in. */
    rows: "rows",
} as const;

/**
 * A data grid (`role="grid"`): rows of cells, which the user moves between with the keys, and can select rows of. Implements the
 * {@link https://www.w3.org/WAI/ARIA/apg/patterns/grid/ | ARIA data grid pattern} with {@link DataGridController}.
 *
 * @remarks
 * One cell is in the tab order: the last focused, or the first. A cell's content is reached with Enter or F2, and left with Escape.
 *
 * Slots: the default slot for the rows.
 *
 * Events: the `change` of a row bubbles through it.
 *
 * @public
 */
export interface DataGridElement extends HTMLElement {
    /**
     * Whether rows are selected, one or several.
     *
     * @remarks
     * HTML attribute: `selection-mode`. The default is `none`.
     */
    selectionMode: DataGridSelectionMode;

    /**
     * The columns of the rows, as CSS `grid-template-columns`, or `null` for columns of the same width.
     *
     * @remarks
     * HTML attribute: `grid-template-columns`.
     */
    gridTemplateColumns: string | null;

    /**
     * Its rows, in order: those in its slot, and those its binding renders.
     */
    readonly rows: readonly DataGridRowElement[];
}
