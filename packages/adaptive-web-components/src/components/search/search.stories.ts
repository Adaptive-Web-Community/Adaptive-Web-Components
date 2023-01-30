import { html } from "@microsoft/fast-element";
import { FASTSearch } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTSearch>>`
    <adaptive-search
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        list="${(x) => x.list}"
        maxlength="${(x) => x.maxlength}"
        minlength="${(x) => x.minlength}"
        name="${(x) => x.name}"
        pattern="${(x) => x.pattern}"
        placeholder="${(x) => x.placeholder}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        resize="${(x) => x.resize}"
        size="${(x) => x.size}"
        ?spellcheck="${(x) => x.spellcheck}"
        value="${(x) => x.value}"
        :ariaAtomic="${(x) => x.ariaAtomic}"
        :ariaBusy="${(x) => x.ariaBusy}"
        :ariaControls="${(x) => x.ariaControls}"
        :ariaCurrent="${(x) => x.ariaCurrent}"
        :ariaDescribedby="${(x) => x.ariaDescribedby}"
        :ariaDetails="${(x) => x.ariaDetails}"
        :ariaDisabled="${(x) => x.ariaDisabled}"
        :ariaErrormessage="${(x) => x.ariaErrormessage}"
        :ariaFlowto="${(x) => x.ariaFlowto}"
        :ariaHaspopup="${(x) => x.ariaHaspopup}"
        :ariaHidden="${(x) => x.ariaHidden}"
        :ariaInvalid="${(x) => x.ariaInvalid}"
        :ariaKeyshortcuts="${(x) => x.ariaKeyshortcuts}"
        :ariaLabel="${(x) => x.ariaLabel}"
        :ariaLabelledby="${(x) => x.ariaLabelledby}"
        :ariaLive="${(x) => x.ariaLive}"
        :ariaOwns="${(x) => x.ariaOwns}"
        :ariaRelevant="${(x) => x.ariaRelevant}"
        :ariaRoledescription="${(x) => x.ariaRoledescription}"
    >
        ${(x) => x.storyContent}
    </adaptive-search>
`;

export default {
    title: "Components/Search",
    args: {
        storyContent: "Search",
        autofocus: false,
        disabled: false,
        readOnly: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        list: { control: "text" },
        maxlength: { control: "number" },
        minlength: { control: "number" },
        name: { control: "text" },
        pattern: { control: "text" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        size: { control: "number" },
        spellcheck: { control: "boolean" },
        value: { control: "text" },
        ariaAtomic: { control: "text" },
        ariaBusy: { control: "text" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "text" },
        ariaErrormessage: { control: "text" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "text" },
        ariaHidden: { control: "text" },
        ariaInvalid: { control: "text" },
        ariaKeyshortcuts: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        ariaLive: { control: "text" },
        ariaOwns: { control: "text" },
        ariaRelevant: { control: "text" },
        ariaRoledescription: { control: "text" },
    },
} as Meta<FASTSearch>;

export const Search: Story<FASTSearch> = renderComponent(storyTemplate).bind({});
