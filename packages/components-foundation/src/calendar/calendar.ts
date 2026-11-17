import type { FormControlElement } from "../utilities/form-control.js";
import type { CalendarContract } from "./calendar.generated.js";

export { CalendarParts, CalendarSlots } from "./calendar.generated.js";

/**
 * A calendar: a month as a grid of days, which the user moves through with the keys and selects one date in, or several. Implements the
 * grid of the {@link https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/ | ARIA date picker}, with
 * {@link CalendarController}.
 *
 * @remarks
 * Dates are ISO dates (`2026-10-27`), as a native date input's. The names of the month, the days of the week, and the numbers are the
 * locale's, from `Intl`. The host is the form control, and delegates its focus; the controller renders the grid, in the `days` part.
 *
 * Slots: `label`, its label (see {@link CalendarContract}), which names the grid with the month shown, and `previous-month` and `next-month`
 * for the content of the buttons.
 *
 * Events: `input` and `change` when the user selects a date.
 *
 * @public
 */
export interface CalendarElement extends FormControlElement, CalendarContract {
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
}
