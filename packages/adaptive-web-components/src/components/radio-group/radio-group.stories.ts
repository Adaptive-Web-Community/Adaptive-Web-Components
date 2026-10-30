import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { storyTemplate as radioStoryTemplate } from "../radio/radio.stories.js";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { RadioGroup as RadioGroupElement } from "./radio-group.js";

const storyTemplate = html<StoryArgs<RadioGroupElement>>`
    <adaptive-radio-group
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?disabled="${(x) => x.disabled}"
        name="${(x) => x.name}"
        orientation="${(x) => x.orientation}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        :value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-radio-group>
`;

export default {
    title: "Components/Radio/Radio Group",
    args: {
        storyContent: html<StoryArgs<RadioGroupElement>>`
            ${repeat((x) => x.storyItems, radioStoryTemplate)}
        `,
        storyItems: [
            { label: "Apples", value: "apples" },
            { label: "Bananas", value: "bananas" },
            { label: "Blueberries", value: "blueberries" },
            { label: "Grapefruit", value: "grapefruit" },
            { label: "Kiwi", value: "kiwi" },
            { label: "Mango", value: "mango" },
            { label: "Oranges", value: "oranges" },
            { label: "Pineapple", value: "pineapple" },
            { label: "Strawberries", value: "strawberries" },
        ],
        label: "Fruits",
        name: "fruits",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        name: { control: "text" },
        orientation: { control: "radio", options: Object.values(Orientation) },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<RadioGroupElement>;

export const RadioGroup: Story<RadioGroupElement> = renderComponent(storyTemplate).bind({});

export const RadioGroupVertical: Story<RadioGroupElement> = RadioGroup.bind({});
RadioGroupVertical.args = {
    orientation: Orientation.vertical,
};

export const RadioGroupInForm: Story<RadioGroupElement> = renderComponent(
    html<StoryArgs<RadioGroupElement>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <adaptive-button type="submit">Submit</adaptive-button>
        </form>
    `
).bind({});
