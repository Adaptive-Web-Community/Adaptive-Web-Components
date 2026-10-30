import { html, repeat } from "@microsoft/fast-element";
import { Orientation } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listItemStoryTemplate } from "../list-item/list-item.stories.js";
import type { List as ListElement } from "./list.js";

const storyTemplate = html<StoryArgs<ListElement>>`
    <adaptive-list
        orientation="${(x) => x.orientation}"
        style="max-width: 400px;"
    >
        ${(x) => x.storyContent}
    </adaptive-list>
`;

export default {
    title: "Components/List",
    args: {
        orientation: Orientation.vertical,
        storyContent: html<StoryArgs<ListElement>>`
            ${repeat((x) => x.storyItems, listItemStoryTemplate)}
        `,
        storyItems: [
            { storyContent: "Item one" },
            { storyContent: html`<a href="#">Item two, a link</a>` },
            { storyContent: "Item three" },
            { storyContent: "Item four" },
            { storyContent: "Item five" },
            { storyContent: "Item six" },
        ],
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        orientation: { control: "radio", options: Object.values(Orientation) },
    },
} as Meta<ListElement>;

export const List: Story<ListElement> = renderComponent(storyTemplate).bind({});

export const ListHorizontal: Story<ListElement> = renderComponent(storyTemplate).bind({});
ListHorizontal.args = {
    orientation: Orientation.horizontal,
};
