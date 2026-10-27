import { type ElementViewTemplate, html, ref } from "@microsoft/fast-element";
import { CalendarParts, type ValuesOf } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Calendar } from "./calendar.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the calendar.
 *
 * @beta
 */
export const CalendarStatics = {
    previous: "calendar-previous-month-icon",
    next: "calendar-next-month-icon",
} as const;

/**
 * @beta
 */
export type CalendarStatics = ValuesOf<typeof CalendarStatics>;

/**
 * @public
 */
export const CalendarConditions = {
    readOnly: "[readonly]",
};

export { CalendarParts };

/**
 * @public
 */
export const CalendarAnatomy: ComponentAnatomy<typeof CalendarConditions, typeof CalendarParts> = {
    interactivity: Interactivity.never,
    conditions: CalendarConditions,
    parts: CalendarParts,
};

/**
 * Default Calendar template: the buttons and the title, and the grid of the days, which the element's controller renders.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Calendar> =
    (ds: DesignSystem) => html<Calendar>`
        <div class="header" part="header">
            <button class="previous-month" part="previous-month" type="button" ${ref("previousButton")}>
                <slot name="previous-month">${staticallyCompose(ds.statics.get(CalendarStatics.previous))}</slot>
            </button>
            <span class="title" part="title" id="title" aria-live="polite" ${ref("titleElement")}></span>
            <button class="next-month" part="next-month" type="button" ${ref("nextButton")}>
                <slot name="next-month">${staticallyCompose(ds.statics.get(CalendarStatics.next))}</slot>
            </button>
        </div>
        <table class="days" part="days" role="grid" aria-labelledby="title" ${ref("days")}></table>
    `;
