import { html, repeat } from "@microsoft/fast-element";
import type { FASTTreeItem, FASTTreeView } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as treeItemStoryTemplate } from "../tree-item/tree-item.stories.js";

const storyTemplate = html<StoryArgs<FASTTreeView>>`
    <adaptive-tree-view>
        ${(x) => x.storyContent}
    </adaptive-tree-view>
`;

const storyContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<FASTTreeItem>>`
            ${x => treeItemStoryTemplate}
        `
    )}
`;

export default {
    title: "Components/Tree view",
    args: {
        renderCollapsedNodes: true,
        storyContent: storyContentTemplate,
        storyItems: [],
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTreeView>;

export const TreeView: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeView.args = {
    storyItems: [
        {
            storyContent: html`
                Root item 1
                ${repeat(x => x.storyItems, treeItemStoryTemplate)}
            `,
            storyItems: [
                {
                    storyContent: html`
                        Flowers
                        ${repeat(x => x.storyItems, treeItemStoryTemplate)}
                    `,
                    storyItems: [
                        {
                            storyContent: "Daisy",
                        },
                        {
                            storyContent: "Sunflower",
                            disabled: true,
                        },
                        {
                            storyContent: html`
                                Rose
                                ${repeat(x => x.storyItems, treeItemStoryTemplate)}
                            `,
                            storyItems: [
                                {
                                    storyContent: "Pink",
                                },
                                {
                                    storyContent: "Red",
                                },
                                {
                                    storyContent: "White",
                                },
                            ],
                        },
                    ],
                    expanded: true,
                },
                {
                    storyContent: "Nested item 2",
                },
                {
                    storyContent: "Nested item 3",
                },
            ],
            expanded: true,
        },
        {
            storyContent: "Root item 2",
            expanded: true,
        },
        {
            storyContent: "Root item 3",
        },
    ],
};

export const TreeViewFlat: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeViewFlat.args = {
    storyItems: [
        { storyContent: "Tree item 1" },
        { storyContent: "Tree item 2" },
        { storyContent: "Tree item 3" },
    ],
};
