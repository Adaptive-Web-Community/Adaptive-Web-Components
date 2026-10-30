import { html, repeat } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { TreeItem as TreeItemElement } from "../tree-item/tree-item.js";
import { storyTemplate as treeItemStoryTemplate } from "../tree-item/tree-item.stories.js";
import type { TreeView as TreeViewElement } from "./tree-view.js";

const storyTemplate = html<StoryArgs<TreeViewElement>>`
    <adaptive-tree-view>
        ${(x) => x.storyContent}
    </adaptive-tree-view>
`;

const storyContentTemplate = html`
    ${repeat(
        x => x.storyItems,
        html<StoryArgs<TreeItemElement>>`
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
} as Meta<TreeViewElement>;

export const TreeView: Story<TreeViewElement> = renderComponent(storyTemplate).bind({});
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

export const TreeViewFlat: Story<TreeViewElement> = renderComponent(storyTemplate).bind({});
TreeViewFlat.args = {
    storyItems: [
        { storyContent: "Tree item 1" },
        { storyContent: "Tree item 2" },
        { storyContent: "Tree item 3" },
    ],
};
