import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridTemplate, FASTDataGrid } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { composeDataGridRow } from '../data-grid-row/index.js';

/**
 * @public
 */
export const DataGridConditions = {
};

/**
 * @public
 */
export const DataGridParts = {
};

/**
 * @public
 */
export const DataGridAnatomy: ComponentAnatomy<typeof DataGridConditions, typeof DataGridParts> = {
    interactivity: Interactivity.never,
    conditions: DataGridConditions,
    parts: DataGridParts,
};

/**
 * Default Data Grid template, {@link @microsoft/fast-foundation#dataGridTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGrid> =
    (ds: DesignSystem) =>
        dataGridTemplate({
            dataGridRow: composeDataGridRow(ds),
        });
