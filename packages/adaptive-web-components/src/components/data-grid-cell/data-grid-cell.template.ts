import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridCellTemplate, FASTDataGridCell } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const DataGridCellConditions = {
    cellTypeDefault: "[cell-type='default']",
    cellTypeColumnHeader: "[cell-type='columnheader']",
    cellTypeRowHeader: "[cell-type='rowheader']",
};

export const DataGridCellParts = {
};

export const DataGridCellAnatomy: ComponentAnatomy<typeof DataGridCellConditions, typeof DataGridCellParts> = {
    interactivity: Interactivity.never,
    conditions: DataGridCellConditions,
    parts: DataGridCellParts,
};

/**
 * Default Data Grid Cell template, {@link @microsoft/fast-foundation#dataGridCellTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridCell> =
    (ds: DesignSystem) =>
        dataGridCellTemplate();
