import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { ProgressRing as ProgressRingElement } from "./progress-ring.js";

const storyTemplate = html<StoryArgs<ProgressRingElement>>`
    <adaptive-progress-ring
        aria-label="Progress"
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
} as Meta<ProgressRingElement>;

export const ProgressRing: Story<ProgressRingElement> = renderComponent(storyTemplate).bind({});
