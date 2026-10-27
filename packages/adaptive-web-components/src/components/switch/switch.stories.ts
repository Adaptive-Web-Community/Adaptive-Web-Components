import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Switch as SwitchElement } from "./switch.js";

const storyTemplate = html<StoryArgs<SwitchElement>>`
    <adaptive-switch
        ?checked="${(x) => x.checked}"
        ?disabled="${(x) => x.disabled}"
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
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<SwitchElement>;

export const Switch: Story<SwitchElement> = renderComponent(storyTemplate).bind({});
