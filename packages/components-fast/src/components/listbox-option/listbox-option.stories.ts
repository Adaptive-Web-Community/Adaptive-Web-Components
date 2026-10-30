import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { ListboxOption as ListboxOptionElement } from "./listbox-option.js";

export const storyTemplate = html<StoryArgs<ListboxOptionElement>>`
    <adaptive-option
        ?disabled="${(x) => x.disabled}"
        id="${(x) => x.id}"
        ?selected="${(x) => x.selected}"
        value="${(x) => x.value}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-option>
`;

export default {
    title: "Components/Listbox/Listbox Option",
    excludeStories: ["storyTemplate"],
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: "Listbox option",
        disabled: false,
        selected: false,
        value: "listbox-value",
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        disabled: { control: "boolean" },
        selected: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<ListboxOptionElement>;

export const ListboxOption: Story<ListboxOptionElement> = renderComponent(storyTemplate).bind({});
