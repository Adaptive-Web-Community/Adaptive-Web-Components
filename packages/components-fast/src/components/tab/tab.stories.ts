import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Tab as TabElement } from "./tab.js";

export const storyTemplate = html<StoryArgs<TabElement>>`
    <adaptive-tab
        ?disabled="${(x) => x.disabled}"
        ?selected="${(x) => x.selected}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-tab>
`;

export default {
    title: "Components/Tablist/Tab",
    excludeStories: ["storyTemplate"],
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: "Tab",
        disabled: false,
        selected: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        disabled: { control: "boolean" },
        selected: { control: "boolean" },
    },
} as Meta<TabElement>;

export const Tab: Story<TabElement> = renderComponent(storyTemplate).bind({});
