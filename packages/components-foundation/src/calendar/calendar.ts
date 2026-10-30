import type { FormControlElement } from "../utilities/form-control.js";
import type { LabelledElement } from "../utilities/label.js";

/**
 * The parts of a {@link CalendarElement}.
 *
 * @public
 */
export const CalendarParts = {
    /** The label: the `label` slot, or the text of the `label` attribute. */
    label: "label",

    /** The row of the buttons and the title. */
    header: "header",

    /** The button that shows the month before, named by that month. */
    previousMonth: "previous-month",

    /** The month and year shown, which name the grid, after the label. */
    title: "title",

    /** The button that shows the month after, named by that month. */
    nextMonth: "next-month",

    /** The grid of the days (`role="grid"`), a table. */
    days: "days",

    /** The row of the names of the days of the week. */
    weekDays: "week-days",

    /** The name of a day of the week, a column header. */
    weekDay: "week-day",

    /** A week, a row. */
    week: "week",

    /** A day, a grid cell, with `aria-selected`, `aria-disabled`, `aria-current="date"` for today, and `data-outside` for a day of another month. */
    day: "day",

    /** The number of a day, in its cell. */
    date: "date",
} as const;

/**
 * A calendar: a month as a grid of days, which the user moves through with the keys and selects one date in, or several. Implements the
 * grid of the {@link https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ | ARIA date picker}, with
 * {@link CalendarController}.
 *
 * @remarks
 * Dates are ISO dates (`2026-10-27`), as a native date input's. The names of the month, the days of the week, and the numbers are the
 * locale's, from `Intl`. The host is the form control, and delegates its focus; the controller renders the grid, in the `days` part.
 *
 * Slots: `label`, its label (see {@link LabelledElement}), which names the grid with the month shown, and `previous-month` and `next-month`
 * for the content of the buttons.
 *
 * Events: `input` and `change` when the user selects a date.
 *
 * @public
 */
export interface CalendarElement extends FormControlElement, LabelledElement {
    /**
     * The name of its value in the form data.
     *
     * @remarks
     * HTML attribute: `name`.
     */
    name: string | null;

    /**
     * The selected date, the first of several with `multiple`, or `""`. Setting it selects that date only.
     */
    value: string;

    /**
     * The selected dates.
     */
    readonly values: readonly string[];

    /**
     * The dates selected by default, and when its form is reset: one, or several separated by commas with `multiple`.
     *
     * @remarks
     * HTML attribute: `value`.
     */
    defaultValue: string | null;

    /**
     * Whether any number of dates can be selected, or one.
     *
     * @remarks
     * HTML attribute: `multiple`.
     */
    multiple: boolean;

    /**
     * The earliest date that can be selected, or `null`.
     *
     * @remarks
     * HTML attribute: `min`.
     */
    min: string | null;

    /**
     * The latest date that can be selected, or `null`.
     *
     * @remarks
     * HTML attribute: `max`.
     */
    max: string | null;

    /**
     * Dates that can't be selected, separated by commas.
     *
     * @remarks
     * HTML attribute: `disabled-dates`.
     */
    disabledDates: string | null;

    /**
     * The month shown, from 1 to 12. The user changes it with the buttons and the keys. Without it, the month of the value, or of today.
     *
     * @remarks
     * HTML attribute: `month`.
     */
    month: number | null;

    /**
     * The year shown. Without it, the year of the value, or of today.
     *
     * @remarks
     * HTML attribute: `year`.
     */
    year: number | null;

    /**
     * The locale of the names and numbers, or `null` for the language of the element (`lang`), or else of the browser.
     *
     * @remarks
     * HTML attribute: `locale`.
     */
    locale: string | null;

    /**
     * The first day of the week, from 0 (Sunday) to 6, or `null` for the locale's.
     *
     * @remarks
     * HTML attribute: `first-day`.
     */
    firstDay: number | null;

    /**
     * Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.
     *
     * @remarks
     * HTML attribute: `disabled`.
     */
    disabled: boolean;

    /**
     * Whether it is read only: the keys move through the days, and the user can't select one.
     *
     * @remarks
     * HTML attribute: `readonly`.
     */
    readOnly: boolean;
}
