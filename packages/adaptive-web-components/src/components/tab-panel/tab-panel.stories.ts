import { html } from "@microsoft/fast-element";
import type { FASTTabPanel } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTTabPanel>>`
    <adaptive-tab-panel>
        ${(x) => x.storyContent}
    </adaptive-tab-panel>
`;

export default {
    title: "Components/Tabs/Tab Panel",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Tab panel",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTabPanel>;

export const TabPanel: Story<FASTTabPanel> = renderComponent(storyTemplate).bind({});
