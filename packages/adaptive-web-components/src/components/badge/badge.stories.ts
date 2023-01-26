import { html } from "@microsoft/fast-element";
import type { FASTBadge } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTBadge>>`
    <adaptive-badge>
        ${(x) => x.storyContent}
    </adaptive-badge>
`;

export default {
    title: "Components/Badge",
    args: {
        storyContent: "Badge",
    },
} as Meta<FASTBadge>;

export const Badge: Story<FASTBadge> = renderComponent(storyTemplate).bind({});
