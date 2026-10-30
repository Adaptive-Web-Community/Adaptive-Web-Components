import { html } from "@microsoft/fast-element";
import { TextAreaResize } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { TextArea as TextAreaElement } from "./text-area.js";

const storyTemplate = html<StoryArgs<TextAreaElement>>`
    <adaptive-text-area
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        ?readonly="${(x) => x.readOnly}"
        cols="${(x) => x.cols}"
        maxlength="${(x) => x.maxLength}"
        minlength="${(x) => x.minLength}"
        name="${(x) => x.name}"
        pattern="${(x) => x.pattern}"
        placeholder="${(x) => x.placeholder}"
        resize="${(x) => x.resize}"
        rows="${(x) => x.rows}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-text-area>
`;

export default {
    title: "Components/Text Area",
    args: {
        label: "Text Area",
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
        placeholder: { control: "text" },
        readOnly: { control: "boolean" },
        cols: { control: "number" },
        rows: { control: "number" },
        required: { control: "boolean" },
        resize: { control: "select", options: Object.values(TextAreaResize) },
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
} as Meta<TextAreaElement>;

export const TextArea: Story<TextAreaElement> = renderComponent(storyTemplate).bind({});
