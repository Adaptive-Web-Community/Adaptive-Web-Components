import { html } from "@microsoft/fast-element";
import type { FASTTreeItem } from "@microsoft/fast-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTTreeItem>>`
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
} as Meta<FASTTreeItem>;

export const TreeItem: Story<FASTTreeItem> = renderComponent(storyTemplate).bind({});
