import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Avatar as AvatarElement } from "./avatar.js";

const storyTemplate = html<StoryArgs<AvatarElement>>`
    <adaptive-avatar name="${(x) => x.name}">
        ${(x) => x.storyContent}
    </adaptive-avatar>
`;

export default {
    title: "Components/Avatar",
    args: {
        name: "Cara Ruiz",
    },
    argTypes: {
        name: { control: "text" },
        storyContent: { table: { disable: true } },
    },
} as Meta<AvatarElement>;

export const Avatar: Story<AvatarElement> = renderComponent(storyTemplate).bind({});
Avatar.args = {
    storyContent: html`
        <img slot="media" src="https://via.placeholder.com/32x32" alt="" />
    `,
};

export const AvatarWithTextContent: Story<AvatarElement> = renderComponent(storyTemplate).bind({});
AvatarWithTextContent.args = {
    storyContent: "CR",
};

export const AvatarWithBadge: Story<AvatarElement> = renderComponent(storyTemplate).bind({});
AvatarWithBadge.args = {
    storyContent: html`
        CR
        <adaptive-badge slot="badge">1</adaptive-badge>
    `,
};