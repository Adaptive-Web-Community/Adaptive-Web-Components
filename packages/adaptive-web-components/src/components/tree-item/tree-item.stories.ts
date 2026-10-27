import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { TreeItem as TreeItemElement } from "./tree-item.js";

export const storyTemplate = html<StoryArgs<TreeItemElement>>`
    <adaptive-tree-item
        ?disabled="${(x) => x.disabled}"
        ?expanded="${(x) => x.expanded}"
        :nested="${(x) => x.nested}"
        ?selected="${(x) => x.selected}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-tree-item>
`;

export default {
    title: "Components/Tree view/Tree Item",
    excludeStories: ["storyTemplate"],
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: "Tree Item",
        disabled: false,
        nested: false,
        selected: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        nested: { control: "boolean" },
        selected: { control: "boolean" },
    },
} as Meta<TreeItemElement>;

export const TreeItem: Story<TreeItemElement> = renderComponent(storyTemplate).bind({});
