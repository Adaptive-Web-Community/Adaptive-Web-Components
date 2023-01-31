import { html } from "@microsoft/fast-element";
import type { FASTAvatar } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTAvatar>>`
    <adaptive-avatar>
        ${(x) => x.storyContent}
    </adaptive-avatar>
`;

export default {
    title: "Components/Avatar",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTAvatar>;

export const Avatar: Story<FASTAvatar> = renderComponent(storyTemplate).bind({});
Avatar.args = {
    storyContent: html`
        <img slot="media" src="https://via.placeholder.com/32x32" alt="Annie's profile image" />
    `,
};

export const AvatarWithTextContent: Story<FASTAvatar> = renderComponent(storyTemplate).bind({});
AvatarWithTextContent.args = {
    storyContent: "CR",
};

export const AvatarWithBadge: Story<FASTAvatar> = renderComponent(storyTemplate).bind({});
AvatarWithBadge.args = {
    storyContent: html`
        CR
        <adaptive-badge slot="badge">1</adaptive-badge>
    `,
};