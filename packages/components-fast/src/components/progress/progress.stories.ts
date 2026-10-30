import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Progress as ProgressElement } from "./progress.js";

const storyTemplate = html<StoryArgs<ProgressElement>>`
    <adaptive-progress
        aria-label="Progress"
        max="${(x) => x.max}"
        min="${(x) => x.min}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-progress>
`;

export default {
    title: "Components/Progress",
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
} as Meta<ProgressElement>;

export const Progress: Story<ProgressElement> = renderComponent(storyTemplate).bind({});
