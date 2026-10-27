import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { ListItem as ListItemElement } from "./list-item.js";

export const storyTemplate = html<StoryArgs<ListItemElement>>`
    <adaptive-list-item>
        ${(x) => x.storyContent}
    </adaptive-list-item>
`;

export default {
    title: "Components/List/List Item",
    excludeStories: ["storyTemplate"],
    args: {
        storyContent: "List item",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
    },
} as Meta<ListItemElement>;

export const ListItem: Story<ListItemElement> = renderComponent(storyTemplate).bind({});
