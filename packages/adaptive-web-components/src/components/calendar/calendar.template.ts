import { ElementViewTemplate } from "@microsoft/fast-element";
import { calendarTemplate, calendarTitleTemplate, FASTCalendar } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { composeDataGridCell } from "../data-grid-cell/index.js";
import { composeDataGridRow } from "../data-grid-row/index.js";
import { composeDataGrid } from "../data-grid/index.js";

export const CalendarConditions = {
};

export const CalendarParts = {
    title: "title",
    month: "month",
    year: "year",
    days: "days",
    week: "week",
    weekDay: "week-day",
    weekDays: "week-days",
    day: "day",
    date: "date",
    today: "today",
};

export const CalendarAnatomy: ComponentAnatomy<typeof CalendarConditions, typeof CalendarParts> = {
    interactivity: Interactivity.never,
    conditions: CalendarConditions,
    parts: CalendarParts,
};

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
