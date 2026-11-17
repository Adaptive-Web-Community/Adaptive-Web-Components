import type { DefaultAria } from "../utilities/aria.js";
import { DataGridCellCellType } from "./data-grid-cell.generated.js";

/**
 * HTML `cell-type` attribute value for each documented {@link DataGridCellCellType} on the web platform.
 *
 * @public
 */
export const dataGridCellTypeAttribute = {
    [DataGridCellCellType.default]: "default",
    [DataGridCellCellType.columnHeader]: "columnheader",
    [DataGridCellCellType.rowHeader]: "rowheader",
} as const satisfies Record<DataGridCellCellType, string>;

/**
 * ARIA `role` for each documented {@link DataGridCellCellType} on the web platform.
 *
 * @public
 */
export const dataGridCellTypeRole = {
    [DataGridCellCellType.default]: "gridcell",
    [DataGridCellCellType.columnHeader]: "columnheader",
    [DataGridCellCellType.rowHeader]: "rowheader",
} as const satisfies Record<DataGridCellCellType, NonNullable<DefaultAria["role"]>>;

const cellTypeByAttribute = new Map<string, DataGridCellCellType>(
    Object.entries(dataGridCellTypeAttribute).map(([cellType, attribute]) => [attribute, cellType as DataGridCellCellType]),
);

/**
 * The {@link DataGridCellCellType} for a `cell-type` attribute value on the web platform.
 *
 * @public
 */
export function dataGridCellTypeFromAttribute(value: string | null): DataGridCellCellType {
    return cellTypeByAttribute.get(value ?? dataGridCellTypeAttribute.default) ?? DataGridCellCellType.default;
}

/**
 * The default ARIA of a data grid cell on the web platform.
 *
 * @public
 */
export function dataGridCellAria(cell: { cellType: DataGridCellCellType }): DefaultAria {
    return { role: dataGridCellTypeRole[cell.cellType] };
}
