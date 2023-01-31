import { html, repeat } from "@microsoft/fast-element";
import type { FASTListboxElement } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionStoryTemplate } from "../listbox-option/listbox-option.stories.js";

const storyTemplate = html<StoryArgs<FASTListboxElement>>`
    <adaptive-listbox
        ?disabled="${(x) => x.disabled}"
        ?multiple="${(x) => x.multiple}"
        size="${(x) => x.size}"
    >
        ${(x) => x.storyContent}
    </adaptive-listbox>
`;

export default {
    title: "Components/Listbox",
    args: {
        storyContent: html<StoryArgs<FASTListboxElement>>`
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
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        multiple: { control: "boolean" },
        size: { control: "number" },
    },
} as Meta<FASTListboxElement>;

export const Listbox: Story<FASTListboxElement> = renderComponent(storyTemplate).bind({});
