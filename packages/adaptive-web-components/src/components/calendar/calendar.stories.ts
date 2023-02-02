import { html } from "@microsoft/fast-element";
import type { FASTCalendar } from "@microsoft/fast-foundation";
import { DayFormat, MonthFormat, WeekdayFormat, YearFormat } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTCalendar>>`
    <adaptive-calendar
        day-format="${(x) => x.dayFormat}"
        disabled-dates="${(x) => x.disabledDates}"
        locale="${(x) => x.locale ?? navigator.language}"
        min-weeks="${(x) => x.minWeeks}"
        month="${(x) => x.month}"
        month-format="${(x) => x.monthFormat}"
        ?readonly="${(x) => x.readonly}"
        selected-dates="${(x) => x.selectedDates}"
        weekday-format="${(x) => x.weekdayFormat}"
        year="${(x) => x.year}"
        year-format="${(x) => x.yearFormat}"
    >
        ${(x) => x.storyContent}
    </adaptive-calendar>
`;

export default {
    title: "Components/Calendar",
    args: {
        readonly: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        dayFormat: { control: "select", options: Object.values(DayFormat) },
        disabledDates: { control: "text" },
        locale: { control: "text" },
        minWeeks: { control: "number", min: 0 },
        month: { control: "number", min: 1, max: 12 },
        monthFormat: { control: "select", options: Object.values(MonthFormat) },
        readonly: { control: "boolean" },
        selectedDates: { control: "text" },
        weekdayFormat: { control: "select", options: Object.values(WeekdayFormat) },
        year: { control: "number" },
        yearFormat: { control: "select", options: Object.values(YearFormat) },
    },
} as Meta<FASTCalendar>;

export const Calendar: Story<FASTCalendar> = renderComponent(storyTemplate).bind({});
