import { html, repeat } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { storyTemplate as listboxOptionTemplate } from "../listbox-option/listbox-option.stories.js";
import type { Picker as PickerElement } from "./picker.js";

const storyTemplate = html<StoryArgs<PickerElement>>`
    <adaptive-picker
        ?disabled="${(x) => x.disabled}"
        ?freeform="${(x) => x.freeform}"
        ?loading="${(x) => x.loading}"
        ?multiple="${(x) => x.multiple}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        aria-label="Fruit"
        name="${(x) => x.name}"
        placeholder="${(x) => x.placeholder}"
    >
        ${(x) => x.storyContent}
    </adaptive-picker>
`;

export default {
    title: "Components/Picker",
    args: {
        storyContent: html<StoryArgs<PickerElement>>` ${repeat((x) => x.storyItems, listboxOptionTemplate)} `,
        storyItems: [
            { storyContent: "Apple" },
            { storyContent: "Banana" },
            { storyContent: "Blueberry" },
            { storyContent: "Mango" },
            { storyContent: "Orange" },
            { storyContent: "Raspberry" },
            { storyContent: "Strawberry" },
        ],
        disabled: false,
        freeform: false,
        loading: false,
        multiple: false,
        readOnly: false,
        required: false,
        placeholder: "Choose fruit",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        storyItems: { table: { disable: true } },
        disabled: { control: "boolean" },
        freeform: { control: "boolean" },
        loading: { control: "boolean" },
        multiple: { control: "boolean" },
        name: { control: "text" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
    },
} as Meta<PickerElement>;

export const Picker: Story<PickerElement> = renderComponent(storyTemplate).bind({});

export const PickerMultiple: Story<PickerElement> = renderComponent(storyTemplate).bind({});
PickerMultiple.args = {
    multiple: true,
};

export const PickerFreeform: Story<PickerElement> = renderComponent(storyTemplate).bind({});
PickerFreeform.storyName = "Picker (freeform, as a combobox)";
PickerFreeform.args = {
    freeform: true,
};
