import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as tabStoryTemplate } from "../tab/tab.stories.js";
import { storyTemplate as tabPanelStoryTemplate } from "../tab-panel/tab-panel.stories.js";
import type { Tablist as TablistElement } from "./tablist.js";

// The tablist and its panels are laid out apart: here the panels are in a container below it.
const storyTemplate = html<StoryArgs<TablistElement>>`
    <div style="display: flex; flex-direction: ${(x) => x.orientation === Orientation.vertical ? "row" : "column"}; gap: 8px;">
        <adaptive-tablist
            orientation="${(x) => x.orientation}"
            panels="story-panels"
        >
            ${repeat((x) => x.storyItems.tabs, tabStoryTemplate)}
        </adaptive-tablist>
        <div id="story-panels">
            ${repeat((x) => x.storyItems.tabPanels, tabPanelStoryTemplate)}
        </div>
    </div>
`;

export default {
    title: "Components/Tablist",
    args: {
        orientation: Orientation.horizontal,
        storyItems: {
            tabs: [
                { storyContent: "Tab one" },
                { storyContent: "Tab two", selected: true },
                { storyContent: "Tab three", disabled: true },
                { storyContent: "Tab four" },
            ],
            tabPanels: [
                { storyContent: "Tab panel one" },
                { storyContent: "Tab panel two" },
                { storyContent: "Tab panel three" },
                { storyContent: "Tab panel four" },
            ],
        },
    },
    argTypes: {
        storyItems: { table: { disable: true } },
        orientation: { control: "radio", options: Object.values(Orientation) },
    },
} as Meta<TablistElement>;

export const Tablist: Story<TablistElement> = renderComponent(storyTemplate).bind({});
