import { html, repeat } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionTemplate } from "../listbox-option/listbox-option.stories.js";
import type { Select as SelectElement } from "./select.js";

const storyTemplate = html<StoryArgs<SelectElement>>`
    <adaptive-select
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?disabled="${(x) => x.disabled}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        name="${(x) => x.name}"
        :value="${(x) => x.value}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-select>
`;

export default {
    title: "Components/Select",
    args: {
        label: "Doctor",
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: html<StoryArgs<SelectElement>>` ${repeat((x) => x.storyItems, listboxOptionTemplate)} `,
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
        readOnly: false,
        required: false,
    },
    argTypes: {
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        name: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<SelectElement>;

export const Select: Story<SelectElement> = renderComponent(storyTemplate).bind({});

export const SelectDisabled: Story<SelectElement> = Select.bind({});
SelectDisabled.args = {
    disabled: true,
};
