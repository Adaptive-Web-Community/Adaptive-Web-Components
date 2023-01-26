import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridCellTemplate, FASTDataGridCell } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Data Grid Cell template, {@link @microsoft/fast-foundation#dataGridCellTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridCell> =
    (ds: DesignSystem) =>
        dataGridCellTemplate();
