import { Interactivity, type PlatformBindingFor } from "@adaptive-web/adaptive-ui";
import { labelledWebConditionSelectors } from "../utilities/labelled.web.binding.js";
import { textInputWebConditionSelectors } from "../text-input/text-input.web.binding.js";
import { calendarDocumentation } from "./calendar.documentation.js";

/**
 * Web platform selectors and style hooks for {@link calendarDocumentation}.
 *
 * @public
 */
export const calendarWebBinding = {
    conditionSelectors: {
        ...labelledWebConditionSelectors,
        disabled: textInputWebConditionSelectors.disabled,
        readOnly: textInputWebConditionSelectors.readOnly,
        multiple: "[multiple]",
    },
    partSelectors: {
        label: ".label",
        header: ".header",
        previousMonth: ".previous-month",
        title: ".title",
        nextMonth: ".next-month",
        days: ".days",
        weekDays: ".week-days",
        weekDay: ".week-day",
        week: ".week",
        day: ".day",
        date: ".date",
    },
    interactivity: Interactivity.never,
} satisfies PlatformBindingFor<typeof calendarDocumentation>;
