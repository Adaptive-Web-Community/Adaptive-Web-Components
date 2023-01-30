import { html } from "@microsoft/fast-element";
import type { FASTTab } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTTab>>`
    <adaptive-tab
        ?disabled="${(x) => x.disabled}"
    >
        ${(x) => x.storyContent}
    </adaptive-tab>
`;

export default {
    title: "Components/Tabs/Tab",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Tab",
        disabled: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        disabled: { control: "boolean" },
    },
} as Meta<FASTTab>;

export const Tab: Story<FASTTab> = renderComponent(storyTemplate).bind({});
