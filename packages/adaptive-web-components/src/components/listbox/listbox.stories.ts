import { html, repeat } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionStoryTemplate } from "../listbox-option/listbox-option.stories.js";
import type { Listbox as ListboxElement } from "./listbox.js";

const storyTemplate = html<StoryArgs<ListboxElement>>`
    <adaptive-listbox
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?disabled="${(x) => x.disabled}"
        ?multiple="${(x) => x.multiple}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        style="max-height: 300px;"
    >
        ${(x) => x.storyContent}
    </adaptive-listbox>
`;

export default {
    title: "Components/Listbox",
    args: {
        label: "Fruit",
        storyContent: html<StoryArgs<ListboxElement>>`
            ${repeat((x) => x.storyItems, listboxOptionStoryTemplate)}
        `,
        storyItems: [
            { storyContent: "William Hartnell" },
            { storyContent: "Patrick Troughton" },
            { storyContent: "Jon Pertwee" },
            { storyContent: "Tom Baker" },
            { storyContent: "Peter Davidson" },
            { storyContent: "Colin Baker" },
            { storyContent: "Sylvester McCoy" },
            { storyContent: "Paul McGann" },
            { storyContent: "Christopher Eccleston" },
            { storyContent: "David Tenant" },
            { storyContent: "Matt Smith" },
            { storyContent: "Peter Capaldi" },
            { storyContent: "Jodie Whittaker" },
            { storyContent: "Ncuti Gatwa" },
        ],
        disabled: false,
        multiple: false,
        readOnly: false,
        required: false,
    },
    argTypes: {
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        multiple: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
    },
} as Meta<ListboxElement>;

export const Listbox: Story<ListboxElement> = renderComponent(storyTemplate).bind({});
