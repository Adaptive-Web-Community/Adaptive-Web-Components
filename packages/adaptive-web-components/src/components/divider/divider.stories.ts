import { html } from "@microsoft/fast-element";
import { DividerRole, FASTDivider } from "@microsoft/fast-foundation";
import { Orientation } from "@microsoft/fast-web-utilities";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTDivider>>`
    <adaptive-divider
        orientation="${(x) => x.orientation}"
        role="${(x) => x.role}"
    >
    </adaptive-divider>
`;

export default {
    title: "Components/Divider",
    args: {
        orientation: Orientation.horizontal,
        role: DividerRole.separator,
    },
    argTypes: {
        orientation: { control: "radio", options: Object.values(Orientation) },
        role: { control: "radio", options: Object.values(DividerRole) },
    },
} as Meta<FASTDivider>;

export const Divider: Story<FASTDivider> = renderComponent(storyTemplate).bind({});

export const DividerPresentation: Story<FASTDivider> = renderComponent(storyTemplate).bind({});
DividerPresentation.storyName = "Divider (presentation role)";
DividerPresentation.args = {
    role: DividerRole.presentation,
};

export const DividerVertical: Story<FASTDivider> = renderComponent(html<StoryArgs<FASTDivider>>`
    <div style="height: 300px;">
        ${storyTemplate}
    </div>
    `).bind({});
DividerVertical.args = {
    orientation: Orientation.vertical,
};
