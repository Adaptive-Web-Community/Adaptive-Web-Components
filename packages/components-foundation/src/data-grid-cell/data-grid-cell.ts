import type { DataGridCellContract } from "./data-grid-cell.generated.js";

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
export interface DataGridCellElement extends HTMLElement, DataGridCellContract {}

export { dataGridCellAria, dataGridCellTypeAttribute, dataGridCellTypeFromAttribute, dataGridCellTypeRole } from "./data-grid-cell.web.aria.js";
