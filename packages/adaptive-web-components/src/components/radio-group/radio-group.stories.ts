import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { storyTemplate as radioStoryTemplate } from "../radio/radio.stories.js";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { RadioGroup as RadioGroupElement } from "./radio-group.js";

const storyTemplate = html<StoryArgs<RadioGroupElement>>`
    <adaptive-radio-group
        name="${(x) => x.name}"
        orientation="${(x) => x.orientation}"
        :value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-radio-group>
`;

export default {
    title: "Components/Radio/Radio Group",
    args: {
        storyContent: html<StoryArgs<RadioGroupElement>>`
            <label slot="label">Fruits</label>
            ${repeat((x) => x.storyItems, radioStoryTemplate)}
        `,
        storyItems: [
            { storyContent: "Apples", value: "apples" },
            { storyContent: "Bananas", value: "bananas" },
            { storyContent: "Blueberries", value: "blueberries" },
            { storyContent: "Grapefruit", value: "grapefruit" },
            { storyContent: "Kiwi", value: "kiwi" },
            { storyContent: "Mango", value: "mango" },
            { storyContent: "Oranges", value: "oranges" },
            { storyContent: "Pineapple", value: "pineapple" },
            { storyContent: "Strawberries", value: "strawberries" },
        ],
        name: "fruits",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        name: { control: "text" },
        orientation: { control: "radio", options: Object.values(Orientation) },
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
