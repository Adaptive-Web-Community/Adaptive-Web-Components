import { type ElementViewTemplate, html } from "@microsoft/fast-element";
import { DataGridCellType } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { DataGridCell } from "./data-grid-cell.js";

/**
 * @public
 */
export const DataGridCellConditions = {
    cellType: {
        default: `[cell-type='${DataGridCellType.default}']`,
        columnHeader: `[cell-type='${DataGridCellType.columnHeader}']`,
        rowHeader: `[cell-type='${DataGridCellType.rowHeader}']`,
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
 * Default Data Grid Cell template: the generated content, and the slot.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<DataGridCell> =
    (ds: DesignSystem) => html<DataGridCell>`
        ${x => x.content}<slot></slot>
    `;
