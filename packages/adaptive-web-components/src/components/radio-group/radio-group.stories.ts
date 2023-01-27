import { html, repeat } from "@microsoft/fast-element";
import type { FASTRadioGroup } from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { storyTemplate as radioStoryTemplate } from "../radio/radio.stories.js";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTRadioGroup>>`
    <adaptive-radio-group
        ?disabled="${(x) => x.disabled}"
        name="${(x) => x.name}"
        orientation="${(x) => x.orientation}"
        ?readonly="${(x) => x.readOnly}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-radio-group>
`;

export default {
    title: "Components/Radio/Radio Group",
    args: {
        storyContent: html<StoryArgs<FASTRadioGroup>>`
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
        disabled: false,
        name: "fruits",
        readOnly: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { control: "object" },
        disabled: { control: "boolean" },
        name: { control: "text" },
        orientation: { control: "radio", options: Object.values(Orientation) },
        readOnly: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<FASTRadioGroup>;

export const RadioGroup: Story<FASTRadioGroup> = renderComponent(storyTemplate).bind({});

export const RadioGroupVertical: Story<FASTRadioGroup> = RadioGroup.bind({});
RadioGroupVertical.args = {
    orientation: Orientation.vertical,
};

export const RadioGroupInForm: Story<FASTRadioGroup> = renderComponent(
    html<StoryArgs<FASTRadioGroup>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <adaptive-button type="submit">Submit</adaptive-button>
        </form>
    `
).bind({});
