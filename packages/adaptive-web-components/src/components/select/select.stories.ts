import { html, repeat } from "@microsoft/fast-element";
import { FASTSelect } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionTemplate } from "../listbox-option/listbox-option.stories.js";

const storyTemplate = html<StoryArgs<FASTSelect>>`
    <adaptive-select
        ?disabled="${(x) => x.disabled}"
        ?multiple="${(x) => x.multiple}"
        ?open="${(x) => x.open}"
        size="${(x) => x.size}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-select>
`;

export default {
    title: "Components/Select",
    args: {
        storyContent: html<StoryArgs<FASTSelect>>` ${repeat((x) => x.storyItems, listboxOptionTemplate)} `,
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
        open: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        multiple: { control: "boolean" },
        name: { control: "text" },
        open: { control: "boolean" },
        size: { control: "number" },
        value: { control: "text" },
    },
} as Meta<FASTSelect>;

export const Select: Story<FASTSelect> = renderComponent(storyTemplate).bind({});

export const SelectMultiple: Story<FASTSelect> = Select.bind({});
SelectMultiple.args = {
    multiple: true,
};

export const SelectWithSize: Story<FASTSelect> = Select.bind({});
SelectWithSize.args = {
    size: 5,
};

export const SelectDisabled: Story<FASTSelect> = Select.bind({});
SelectDisabled.args = {
    disabled: true,
};
