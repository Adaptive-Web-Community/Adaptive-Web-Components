import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridRowTemplate, FASTDataGridRow } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { DataGridCellDefinition } from "../data-grid-cell/index.js";

/**
 * Default Data Grid Row template, {@link @microsoft/fast-foundation#dataGridRowTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGridRow> =
    (ds: DesignSystem) =>
        dataGridRowTemplate({
            dataGridCell: DataGridCellDefinition(ds),
        });
