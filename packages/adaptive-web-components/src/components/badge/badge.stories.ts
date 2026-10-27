import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Badge as BadgeElement } from "./badge.js";

const storyTemplate = html<StoryArgs<BadgeElement>>`
    <adaptive-badge>
        ${(x) => x.storyContent}
    </adaptive-badge>
`;

export default {
    title: "Components/Badge",
    args: {
        storyContent: "Badge",
    },
} as Meta<BadgeElement>;

export const Badge: Story<BadgeElement> = renderComponent(storyTemplate).bind({});
