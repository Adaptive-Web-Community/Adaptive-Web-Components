import { html } from "@microsoft/fast-element";
import type { FASTTreeView } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTTreeView>>`
    <adaptive-tree-view>
        ${(x) => x.storyContent}
    </adaptive-tree-view>
`;

export default {
    title: "Components/Tree view",
    args: {
        renderCollapsedNodes: true,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<FASTTreeView>;

export const TreeView: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeView.args = {
    storyContent: html`
        <adaptive-tree-item>
            Root item 1
            <adaptive-tree-item expanded>
                Flowers
                <adaptive-tree-item>Daisy</adaptive-tree-item>
                <adaptive-tree-item disabled>Sunflower</adaptive-tree-item>
                <adaptive-tree-item expanded>
                    Rose
                    <adaptive-tree-item>Pink</adaptive-tree-item>
                    <adaptive-tree-item>Red</adaptive-tree-item>
                    <adaptive-tree-item>White</adaptive-tree-item>
                </adaptive-tree-item>
            </adaptive-tree-item>
            <adaptive-tree-item>Nested item 2</adaptive-tree-item>
            <adaptive-tree-item>Nested item 3</adaptive-tree-item>
        </adaptive-tree-item>
        <adaptive-tree-item expanded>
            Root item 2
            <adaptive-tree-item>
                Flowers
                <adaptive-tree-item disabled>Daisy</adaptive-tree-item>
                <adaptive-tree-item>Sunflower</adaptive-tree-item>
                <adaptive-tree-item>Rose</adaptive-tree-item>
            </adaptive-tree-item>
            <adaptive-tree-item>Nested item 2</adaptive-tree-item>
            <adaptive-tree-item>Nested item 3</adaptive-tree-item>
        </adaptive-tree-item>
        <adaptive-tree-item>
            Root item 3
        </adaptive-tree-item>
    `,
};

export const TreeViewFlat: Story<FASTTreeView> = renderComponent(storyTemplate).bind({});
TreeViewFlat.args = {
    storyContent: html`
        <adaptive-tree-item>
            Tree item 1
        </adaptive-tree-item>
        <adaptive-tree-item>
            Tree item 2
        </adaptive-tree-item>
        <adaptive-tree-item>
            Tree item 3
        </adaptive-tree-item>
    `,
};
