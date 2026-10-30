import { html } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Divider as DividerElement } from "./divider.js";

// The default role is the separator; the author gives `presentation` for a divider that is only decoration.
const roles = ["separator", "presentation"];

export const storyTemplate = html<StoryArgs<DividerElement>>`
    <adaptive-divider
        orientation="${(x) => x.orientation}"
        role="${(x) => x.role}"
    >
    </adaptive-divider>
`;

export default {
    title: "Components/Divider",
    excludeStories: ["storyTemplate"],
    args: {
        orientation: Orientation.horizontal,
        role: "separator",
    },
    argTypes: {
        orientation: { control: "radio", options: Object.values(Orientation) },
        role: { control: "radio", options: roles },
    },
} as Meta<DividerElement>;

export const Divider: Story<DividerElement> = renderComponent(storyTemplate).bind({});

export const DividerPresentation: Story<DividerElement> = renderComponent(storyTemplate).bind({});
DividerPresentation.storyName = "Divider (presentation role)";
DividerPresentation.args = {
    role: "presentation",
};

export const DividerVertical: Story<DividerElement> = renderComponent(html<StoryArgs<DividerElement>>`
    <div style="height: 300px;">
        ${storyTemplate}
    </div>
    `).bind({});
DividerVertical.args = {
    orientation: Orientation.vertical,
};
