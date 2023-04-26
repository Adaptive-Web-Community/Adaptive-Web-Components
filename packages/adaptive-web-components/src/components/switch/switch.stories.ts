import { html } from "@microsoft/fast-element";
import type { FASTSwitch } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTSwitch>>`
    <adaptive-switch
        ?checked="${(x) => x.checked}"
        ?disabled="${(x) => x.disabled}"
        ?readOnly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-switch>
`;

export default {
    title: "Components/Switch",
    args: {
        storyContent: "Switch",
        checked: false,
        disabled: false,
        readOnly: false,
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<FASTSwitch>;

export const Switch: Story<FASTSwitch> = renderComponent(storyTemplate).bind({});
