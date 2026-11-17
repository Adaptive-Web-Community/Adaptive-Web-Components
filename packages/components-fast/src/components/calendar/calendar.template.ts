import { elements, type ElementViewTemplate, html, ref, slotted } from "@microsoft/fast-element";
import { calendarDocumentation, CalendarParts, CalendarSlots, calendarWebBinding, type ValuesOf } from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import { staticallyCompose } from "../../utilities/template-helpers.js";
import type { Calendar } from "./calendar.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the calendar.
 *
 * @public
 */
export const CalendarStatics = {
    previous: "calendar-previous-month-icon",
    next: "calendar-next-month-icon",
} as const;

/**
 * @public
 */
export type CalendarStatics = ValuesOf<typeof CalendarStatics>;

/**
 * @public
 */
export const CalendarAnatomy = documentationToComponentAnatomy(calendarDocumentation, calendarWebBinding);

/**
 * Default Calendar template: the label; the buttons and the title; and the grid of the days, which the element's controller renders, named
 * by the label and the title.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Calendar> =
    (ds: DesignSystem) => html<Calendar>`
        <span class=${(_) => CalendarParts.label} part=${(_) => CalendarParts.label} id="label" ?hidden="${x => !x.label && !x.labelElements.length}">
            <slot name=${(_) => CalendarSlots.label} ${slotted({ property: "labelElements", filter: elements() })}>${x => x.label}</slot>
        </span>
        <div class=${(_) => CalendarParts.header} part=${(_) => CalendarParts.header}>
            <button class=${(_) => CalendarParts.previousMonth} part=${(_) => CalendarParts.previousMonth} type="button" ${ref("previousButton")}>
                <slot name=${(_) => CalendarSlots.previousMonth}>${staticallyCompose(ds.statics.get(CalendarStatics.previous))}</slot>
            </button>
            <span class=${(_) => CalendarParts.title} part=${(_) => CalendarParts.title} id="title" aria-live="polite" ${ref("titleElement")}></span>
            <button class=${(_) => CalendarParts.nextMonth} part=${(_) => CalendarParts.nextMonth} type="button" ${ref("nextButton")}>
                <slot name=${(_) => CalendarSlots.nextMonth}>${staticallyCompose(ds.statics.get(CalendarStatics.next))}</slot>
            </button>
        </div>
        <table class=${(_) => CalendarParts.days} part=${(_) => CalendarParts.days} role="grid" aria-labelledby="label title" ${ref("days")}></table>
    `;
