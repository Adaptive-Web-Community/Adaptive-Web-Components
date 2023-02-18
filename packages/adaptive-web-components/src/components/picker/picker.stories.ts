import { html } from "@microsoft/fast-element";
import { FASTPicker, MenuPlacement } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTPicker>>`
    <adaptive-picker
        ?filter-query="${(x) => x.filterQuery}"
        ?filter-selected="${(x) => x.filterSelected}"
        label="${(x) => x.label}"
        labelled-by="${(x) => x.labelledBy}"
        loading-text="${(x) => x.loadingText}"
        max-selected="${(x) => x.maxSelected}"
        menu-placement="${(x) => x.menuPlacement}"
        no-suggestions-text="${(x) => x.noSuggestionsText}"
        options="${(x) => x.options}"
        placeholder="${(x) => x.placeholder}"
        selection="${(x) => x.selection}"
        suggestions-available-text="${(x) => x.suggestionsAvailableText}"
    ></adaptive-picker>
`;

export default {
    title: "Components/Picker",
    args: {
        // TODO: These are always true https://github.com/microsoft/fast/issues/6311
        filterQuery: true,
        filterSelected: true,
    },
    argTypes: {
        filterQuery: { control: "boolean" },
        filterSelected: { control: "boolean" },
        label: { control: "text" },
        labelledBy: { control: "text" },
        loadingText: { control: "text" },
        maxSelected: { control: "number" },
        menuPlacement: { control: "select", options: Object.values(MenuPlacement) },
        noSuggestionsText: { control: "text" },
        placeholder: { control: "text" },
        suggestionsAvailableText: { control: "text" },
    },
} as Meta<FASTPicker>;

export const Picker: Story<FASTPicker> = renderComponent(html<StoryArgs<FASTPicker>>`
    <div style="height: 300px;">
        ${storyTemplate}
    </div>
`).bind({});
Picker.args = {
    label: "Fruit picker",
    loadingText: "Loading",
    noSuggestionsText: "No such fruit",
    options: "apple, orange, banana, mango, strawberry, raspberry, blueberry",
    placeholder: "Choose fruit",
    selection: "apple",
    suggestionsAvailableText: "Found some fruit",
};
