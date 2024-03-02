import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { DesignTokenContext as DesignTokenContextElement } from "./design-token-context.js";

const storyTemplate = html<StoryArgs<DesignTokenContextElement>>`
    <adaptive-design-token-context>
        ${(x) => x.storyContent}
    </adaptive-design-token-context>
`;

export default {
    title: "Components/Design token context",
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<DesignTokenContextElement>;

export const DesignTokenContext: Story<DesignTokenContextElement> = renderComponent(storyTemplate).bind({});
DesignTokenContext.args = {
    storyContent: html`
        Design Token Context
    `,
};
