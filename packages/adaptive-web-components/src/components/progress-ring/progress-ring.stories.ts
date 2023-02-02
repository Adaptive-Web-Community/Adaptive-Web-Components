import { html } from "@microsoft/fast-element";
import type { FASTProgressRing } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTProgressRing>>`
    <adaptive-progress-ring
        max="${(x) => x.max}"
        min="${(x) => x.min}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-progress-ring>
`;

export default {
    title: "Components/Progress Ring",
    args: {
        indeterminate: false,
        value: 75,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        indeterminate: { control: "boolean" },
        max: { control: "number" },
        min: { control: "number" },
        value: { control: "number", if: { arg: "indeterminate", truthy: false } },
    },
} as Meta<FASTProgressRing>;

export const ProgressRing: Story<FASTProgressRing> = renderComponent(storyTemplate).bind({});
