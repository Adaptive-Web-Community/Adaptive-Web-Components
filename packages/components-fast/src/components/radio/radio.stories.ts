import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Radio as RadioElement } from "./radio.js";

export const storyTemplate = html<StoryArgs<RadioElement>>`
    <adaptive-radio
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?checked="${(x) => x.checked}"
        ?disabled="${(x) => x.disabled}"
        ?required="${(x) => x.required}"
        name="${(x) => x.name}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-radio>
`;

export default {
    title: "Components/Radio",
    excludeStories: ["storyTemplate"],
    args: {
        label: "Label",
        checked: false,
        disabled: false,
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        name: { control: "text" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<RadioElement>;

export const Radio: Story<RadioElement> = renderComponent(storyTemplate).bind({});

export const RadioInForm: Story<RadioElement> = renderComponent(
    html<StoryArgs<RadioElement>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <adaptive-button type="submit">Submit</adaptive-button>
        </form>
    `
).bind({});
