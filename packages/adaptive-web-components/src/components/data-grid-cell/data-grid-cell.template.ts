import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridCellTemplate, DataGridCellTypes, FASTDataGridCell } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const DataGridCellConditions = {
    cellType: {
        default: `[cell-type='${DataGridCellTypes.default}']`,
        columnHeader: `[cell-type='${DataGridCellTypes.columnHeader}']`,
        rowHeader: `[cell-type='${DataGridCellTypes.rowHeader}']`,
    }
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
    focus: Focus.contextFocused(),
};

/**
 * Default Data Grid Cell template, {@link @microsoft/fast-foundation#dataGridCellTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridCell> =
    (ds: DesignSystem) =>
        dataGridCellTemplate();
