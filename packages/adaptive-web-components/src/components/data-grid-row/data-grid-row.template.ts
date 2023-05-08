import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridRowTemplate, FASTDataGridRow } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { composeDataGridCell } from "../data-grid-cell/index.js";

/**
 * @public
 */
export const DataGridRowConditions = {
    rowTypeDefault: "[row-type='default']",
    rowTypeHeader: "[row-type='header']",
    rowTypeStickyHeader: "[row-type='stick-header']",
    selected: "[aria-selected='true']",
};

/**
 * @public
 */
export const DataGridRowParts = {
};

/**
 * @public
 */
export const DataGridRowAnatomy: ComponentAnatomy<typeof DataGridRowConditions, typeof DataGridRowParts> = {
    interactivity: Interactivity.never,
    conditions: DataGridRowConditions,
    parts: DataGridRowParts,
};

/**
 * Default Data Grid Row template, {@link @microsoft/fast-foundation#dataGridRowTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridRow> =
    (ds: DesignSystem) =>
        dataGridRowTemplate({
            dataGridCell: composeDataGridCell(ds)
        });
