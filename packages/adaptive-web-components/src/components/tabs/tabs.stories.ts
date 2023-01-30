import { html, repeat } from "@microsoft/fast-element";
import { FASTTabs, TabsOrientation } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as tabStoryTemplate } from "../tab/tab.stories.js";
import { storyTemplate as tabPanelStoryTemplate } from "../tab-panel/tab-panel.stories.js";

const storyTemplate = html<StoryArgs<FASTTabs>>`
    <adaptive-tabs
        activeId="${(x) => x.activeId}"
        ?hide-active-indicator="${(x) => x.hideActiveIndicator}"
        orientation="${(x) => x.orientation}"
    >
        ${x => x.storyContent}
    </adaptive-tabs>
`;

export default {
    title: "Components/Tabs",
    args: {
        storyContent: html<StoryArgs<FASTTabs>>`
            ${repeat((x) => x.storyItems.tabs, tabStoryTemplate)}
            ${repeat((x) => x.storyItems.tabPanels, tabPanelStoryTemplate)}
        `,
        hideActiveIndicator: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        activeid: { control: "text" },
        hideActiveIndicator: { control: "boolean" },
        orientation: { control: "radio", options: Object.values(TabsOrientation) },
    },
} as Meta<FASTTabs>;

export const Tabs: Story<FASTTabs> = renderComponent(storyTemplate).bind({});
Tabs.args = {
    storyItems: {
        tabs: [
            { storyContent: "Tab one" },
            { storyContent: "Tab two" },
            { storyContent: "Tab three" }
        ],
        tabPanels: [
            { storyContent: "Tab panel one" },
            { storyContent: "Tab panel two" },
            { storyContent: "Tab panel three" },
        ],
    },
};
