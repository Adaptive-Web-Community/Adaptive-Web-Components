/* eslint-disable */
// This file is generated from src/calendar/calendar.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

import type { LabelledContract } from "../utilities/labelled.generated.js";

/**
 * Part names of Calendar for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const CalendarParts = {
    /** The `label` slot or `label` attribute text that names the grid. */
    label: "label",

    /** The previous button, title, and next button. */
    header: "header",

    /** Shows the previous month. */
    previousMonth: "previous-month",

    /** The month and year shown. */
    title: "title",

    /** Shows the next month. */
    nextMonth: "next-month",

    /** The grid of days (`role="grid"`). */
    days: "days",

    /** The row of weekday names. */
    weekDays: "week-days",

    /** One weekday column header. */
    weekDay: "week-day",

    /** One week row. */
    week: "week",

    /** One day cell. */
    day: "day",

    /** The day number in the cell. */
    date: "date",
} as const;

/**
 * Slot names of Calendar.
 *
 * @public
 */
export const CalendarSlots = {
    /** Visible label (see the `labelled` contract). */
    label: "label",

    /** Content of the previous-month button. */
    previousMonth: "previous-month",

    /** Content of the next-month button. */
    nextMonth: "next-month",
} as const;

/**
 * A **Calendar** shows one month as a grid of days for selecting one date or several, as a form control.
 *
 * @public
 */
export interface CalendarContract extends LabelledContract {
    /**
     * The name of its value in the form data.
     */
    name: string | null;

    /**
     * The selected date, or the first of several with `multiple`, or an empty string.
     */
    value: string;

    /**
     * Whether any number of dates can be selected, or one.
     */
    multiple: boolean;

    /**
     * The earliest selectable date, or null.
     */
    min: string | null;

    /**
     * The latest selectable date, or null.
     */
    max: string | null;

    /**
     * Dates that can't be selected, comma-separated.
     */
    disabledDates: string | null;

    /**
     * The month shown (1–12), or null to derive from the value or today.
     */
    month: number | null;

    /**
     * The year shown, or null to derive from the value or today.
     */
    year: number | null;

    /**
     * The locale for names and numbers, or null for `lang` or the browser.
     */
    locale: string | null;

    /**
     * The first day of the week (0–6), or null for the locale's.
     */
    firstDay: number | null;

    /**
     * Whether it is disabled. A disabled `<fieldset>` also disables it: select `:disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: keys move but dates can't be selected.
     */
    readOnly: boolean;
}
