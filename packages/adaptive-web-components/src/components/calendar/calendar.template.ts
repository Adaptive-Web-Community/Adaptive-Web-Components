import { ElementViewTemplate } from "@microsoft/fast-element";
import { calendarTemplate, calendarTitleTemplate, FASTCalendar } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { composeDataGridCell } from "../data-grid-cell/index.js";
import { composeDataGridRow } from "../data-grid-row/index.js";
import { composeDataGrid } from "../data-grid/index.js";

/**
 * Default Calendar template, {@link @microsoft/fast-foundation#calendarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCalendar> =
    (ds: DesignSystem) =>
        calendarTemplate({
            dataGridCell: composeDataGridCell(ds),
            dataGridRow: composeDataGridRow(ds),
            dataGrid: composeDataGrid(ds),
            title: calendarTitleTemplate(),
        });
