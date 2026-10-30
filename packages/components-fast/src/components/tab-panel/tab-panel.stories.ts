import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { TabPanel as TabPanelElement } from "./tab-panel.js";

export const storyTemplate = html<StoryArgs<TabPanelElement>>`
    <adaptive-tab-panel>
        ${(x) => x.storyContent}
    </adaptive-tab-panel>
`;

export default {
    title: "Components/Tablist/Tab Panel",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "Tab panel",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<TabPanelElement>;

export const TabPanel: Story<TabPanelElement> = renderComponent(storyTemplate).bind({});
