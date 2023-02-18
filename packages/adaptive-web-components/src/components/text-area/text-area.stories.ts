import { html } from "@microsoft/fast-element";
import { FASTTextArea, TextAreaResize } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTTextArea>>`
    <adaptive-text-area
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        ?readonly="${(x) => x.readOnly}"
        ?spellcheck="${(x) => x.spellcheck}"
        cols="${(x) => x.cols}"
        form="${(x) => x.form}"
        list="${(x) => x.list}"
        maxlength="${(x) => x.maxlength}"
        minlength="${(x) => x.minlength}"
        name="${(x) => x.name}"
        pattern="${(x) => x.pattern}"
        placeholder="${(x) => x.placeholder}"
        resize="${(x) => x.resize}"
        rows="${(x) => x.rows}"
        size="${(x) => x.size}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-text-area>
`;

export default {
    title: "Components/Text Area",
    args: {
        storyContent: "Text Area",
        autofocus: false,
        disabled: false,
        readOnly: false,
        spellcheck: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        list: { control: "text" },
        maxlength: { control: "number" },
        minlength: { control: "number" },
        name: { control: "text" },
        placeholder: { control: "text" },
        form: { control: "text" },
        readOnly: { control: "boolean" },
        cols: { control: "number" },
        rows: { control: "number" },
        required: { control: "boolean" },
        resize: { control: "select", options: Object.values(TextAreaResize) },
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
} as Meta<FASTTextArea>;

export const TextArea: Story<FASTTextArea> = renderComponent(storyTemplate).bind({});
