import { html } from "@microsoft/fast-element";
import type { FASTListboxOption } from "@microsoft/fast-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

export const storyTemplate = html<StoryArgs<FASTListboxOption>>`
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
        ariaChecked: { control: "text" },
        ariaPosInSet: { control: "text" },
        ariaSelected: { control: "text" },
        ariaSetSize: { control: "text" },
    },
} as Meta<FASTListboxOption>;

export const ListboxOption: Story<FASTListboxOption> = renderComponent(storyTemplate).bind({});
