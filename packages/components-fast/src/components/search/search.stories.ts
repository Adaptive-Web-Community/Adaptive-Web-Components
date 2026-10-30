import { html } from "@microsoft/fast-element";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Search as SearchElement } from "./search.js";

const storyTemplate = html<StoryArgs<SearchElement>>`
    <adaptive-search
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        maxlength="${(x) => x.maxLength}"
        minlength="${(x) => x.minLength}"
        name="${(x) => x.name}"
        pattern="${(x) => x.pattern}"
        placeholder="${(x) => x.placeholder}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        value="${(x) => x.value}"
        aria-atomic="${(x) => x.ariaAtomic}"
        aria-busy="${(x) => x.ariaBusy}"
        aria-controls="${(x) => x.ariaControls}"
        aria-current="${(x) => x.ariaCurrent}"
        aria-describedby="${(x) => x.ariaDescribedby}"
        aria-details="${(x) => x.ariaDetails}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-errormessage="${(x) => x.ariaErrormessage}"
        aria-flowto="${(x) => x.ariaFlowto}"
        aria-haspopup="${(x) => x.ariaHaspopup}"
        aria-hidden="${(x) => x.ariaHidden}"
        aria-invalid="${(x) => x.ariaInvalid}"
        aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-live="${(x) => x.ariaLive}"
        aria-owns="${(x) => x.ariaOwns}"
        aria-relevant="${(x) => x.ariaRelevant}"
        aria-roledescription="${(x) => x.ariaRoledescription}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-search>
`;

export default {
    title: "Components/Search",
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        label: "Search",
        autofocus: false,
        disabled: false,
        readOnly: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        maxLength: { control: "number" },
        minLength: { control: "number" },
        name: { control: "text" },
        pattern: { control: "text" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
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
} as Meta<SearchElement>;

export const Search: Story<SearchElement> = renderComponent(storyTemplate).bind({});
