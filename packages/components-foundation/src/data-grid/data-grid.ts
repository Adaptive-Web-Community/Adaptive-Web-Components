import type { DataGridRowElement } from "../data-grid-row/data-grid-row.js";
import type { ValuesOf } from "../utilities/typings.js";
import type { DataGridContract } from "./data-grid.generated.js";

export { DataGridParts, DataGridSlots } from "./data-grid.generated.js";

/**
 * Whether a {@link DataGridElement} selects rows, one or several.
 *
 * @public
 */
export const DataGridSelectionMode = {
    none: "none",
    singleRow: "single-row",
    multiRow: "multi-row",
} as const;

/**
 * Whether a {@link DataGridElement} selects rows, one or several.
 *
 * @public
 */
export type DataGridSelectionMode = ValuesOf<typeof DataGridSelectionMode>;

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
export interface DataGridElement extends HTMLElement, Omit<DataGridContract, "selectionMode"> {
    /**
     * Whether rows are selected, one or several.
     */
    selectionMode: DataGridSelectionMode;

    /**
     * Its rows, in order: those in its slot, and those its binding renders.
     */
    readonly rows: readonly DataGridRowElement[];
}
