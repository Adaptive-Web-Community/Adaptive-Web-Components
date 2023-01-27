import { html } from "@microsoft/fast-element";
import type { FASTRadio } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTRadio>>`
    <adaptive-radio
        ?checked="${(x) => x.checked}"
        ?disabled="${(x) => x.disabled}"
        ?required="${(x) => x.required}"
        ?readonly="${(x) => x.readOnly}"
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
        storyContent: "Label",
        checked: false,
        disabled: false,
        readOnly: false,
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        name: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<FASTRadio>;

export const Radio: Story<FASTRadio> = renderComponent(storyTemplate).bind({});

export const RadioInForm: Story<FASTRadio> = renderComponent(
    html<StoryArgs<FASTRadio>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <adaptive-button type="submit">Submit</adaptive-button>
        </form>
    `
).bind({});
