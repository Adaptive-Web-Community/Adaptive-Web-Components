import { ElementViewTemplate } from "@microsoft/fast-element";
import { dataGridTemplate, FASTDataGrid } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { DataGridRowDefinition } from "../data-grid-row/index.js";

/**
 * Default Data Grid template, {@link @microsoft/fast-foundation#dataGridTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDataGrid> =
    (ds: DesignSystem) =>
        dataGridTemplate({
            dataGridRow: DataGridRowDefinition(ds),
        });
