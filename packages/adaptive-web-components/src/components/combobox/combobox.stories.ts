import { html, repeat } from "@microsoft/fast-element";
import { ComboboxAutocomplete, FASTCombobox } from "@microsoft/fast-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionTemplate } from "../listbox-option/listbox-option.stories.js";

const storyTemplate = html<StoryArgs<FASTCombobox>>`
    <adaptive-combobox
        autocomplete="${(x) => x.autocomplete}"
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        id="${(x) => x.id}"
        name="${(x) => x.name}"
        ?open="${(x) => x.open}"
        placeholder="${(x) => x.placeholder}"
        ?required="${(x) => x.required}"
        value="${(x) => x.value}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-combobox>
`;

export default {
    title: "Components/Combobox",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: html`
            ${repeat((x) => x.storyItems, listboxOptionTemplate)}
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
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        autocomplete: { control: "select", options: Object.values(ComboboxAutocomplete) },
        disabled: { control: "boolean" },
        id: { control: "text" },
        open: { control: "boolean" },
        placeholder: { control: "text" },
        value: { control: "text" },
    },
} as Meta<FASTCombobox>;

export const Combobox: Story<FASTCombobox> = renderComponent(storyTemplate).bind({});

export const ComboboxDisabled: Story<FASTCombobox> = Combobox.bind({});
ComboboxDisabled.args = {
    disabled: true,
};

export const ComboboxWithPlaceholder: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithPlaceholder.args = {
    placeholder: "Select a character",
};

export const ComboboxWithInlineAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithInlineAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.inline,
};

export const ComboboxWithListAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithListAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.list,
};

export const ComboboxWithBothAutocomplete: Story<FASTCombobox> = Combobox.bind({});
ComboboxWithBothAutocomplete.args = {
    autocomplete: ComboboxAutocomplete.both,
};
