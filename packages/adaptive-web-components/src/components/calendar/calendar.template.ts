import { ElementViewTemplate } from "@microsoft/fast-element";
import { calendarTemplate, calendarTitleTemplate, FASTCalendar } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";
import { DataGridCellDefinition, DataGridDefinition, DataGridRowDefinition } from "../index.js";

/**
 * Default Calendar template, {@link @microsoft/fast-foundation#calendarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCalendar> =
    (ds: DesignSystem) =>
        calendarTemplate({
            dataGridCell: DataGridCellDefinition(ds),
            dataGridRow: DataGridRowDefinition(ds),
            dataGrid: DataGridDefinition(ds),
            title: calendarTitleTemplate(),
        });
