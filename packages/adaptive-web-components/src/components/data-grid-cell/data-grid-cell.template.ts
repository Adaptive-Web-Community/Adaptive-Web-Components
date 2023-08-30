import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridCellTemplate, DataGridCellTypes, FASTDataGridCell } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const DataGridCellConditions = {
    cellTypeDefault: `[cell-type='${DataGridCellTypes.default}']`,
    cellTypeColumnHeader: `[cell-type='${DataGridCellTypes.columnHeader}']`,
    cellTypeRowHeader: `[cell-type='${DataGridCellTypes.rowHeader}']`,
};

/**
 * @public
 */
export const DataGridCellParts = {
};

/**
 * @public
 */
export const DataGridCellAnatomy: ComponentAnatomy<typeof DataGridCellConditions, typeof DataGridCellParts> = {
    interactivity: Interactivity.never,
    conditions: DataGridCellConditions,
    parts: DataGridCellParts,
};

/**
 * Default Data Grid Cell template, {@link @microsoft/fast-foundation#dataGridCellTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridCell> =
    (ds: DesignSystem) =>
        dataGridCellTemplate();
