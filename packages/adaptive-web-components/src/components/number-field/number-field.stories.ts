import { html } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import { FASTNumberField } from "@microsoft/fast-foundation";

const storyTemplate = html<StoryArgs<FASTNumberField>>`
    <adaptive-number-field
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        ?hide-step="${(x) => x.hideStep}"
        :list="${(x) => x.list}"
        max="${(x) => x.max}"
        maxlength="${(x) => x.maxlength}"
        min="${(x) => x.min}"
        minlength="${(x) => x.minlength}"
        placeholder="${(x) => x.placeholder}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        size="${(x) => x.size}"
        step="${(x) => x.step}"
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
    </adaptive-number-field>
`;

export default {
    title: "Components/Number Field",
    args: {
        storyContent: "Number Field",
        autofocus: false,
        disabled: false,
        hideStep: false,
        readOnly: false,
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        hideStep: { control: "boolean" },
        list: { control: "text" },
        max: { control: "number" },
        maxlength: { control: "number" },
        min: { control: "number" },
        minlength: { control: "number" },
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        size: { control: "number" },
        step: { control: "number" },
        value: { control: "number" },
        valueAsNumber: { control: "number" },
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
} as Meta<FASTNumberField>;

export const NumberField: Story<FASTNumberField> = renderComponent(storyTemplate).bind({});
