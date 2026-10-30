import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Calendar as CalendarElement } from "./calendar.js";

const storyTemplate = html<StoryArgs<CalendarElement>>`
    <adaptive-calendar
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        disabled-dates="${(x) => x.disabledDates}"
        first-day="${(x) => x.firstDay}"
        locale="${(x) => x.locale}"
        max="${(x) => x.max}"
        min="${(x) => x.min}"
        month="${(x) => x.month}"
        ?multiple="${(x) => x.multiple}"
        ?readonly="${(x) => x.readOnly}"
        ?disabled="${(x) => x.disabled}"
        value="${(x) => x.value}"
        year="${(x) => x.year}"
    ></adaptive-calendar>
`;

export default {
    title: "Components/Calendar",
    args: {
        label: "Date",
        disabled: false,
        multiple: false,
        readOnly: false,
    },
    argTypes: {
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        disabled: { control: "boolean" },
        disabledDates: { control: "text" },
        firstDay: { control: "number", min: 0, max: 6 },
        locale: { control: "text" },
        max: { control: "text" },
        min: { control: "text" },
        month: { control: "number", min: 1, max: 12 },
        multiple: { control: "boolean" },
        readOnly: { control: "boolean" },
        value: { control: "text" },
        year: { control: "number" },
    },
} as Meta<CalendarElement>;

export const Calendar: Story<CalendarElement> = renderComponent(storyTemplate).bind({});

export const CalendarWithRange: Story<CalendarElement> = renderComponent(storyTemplate).bind({});
CalendarWithRange.args = {
    value: "2026-10-15",
    min: "2026-10-05",
    max: "2026-11-20",
    disabledDates: "2026-10-10, 2026-10-11",
};
