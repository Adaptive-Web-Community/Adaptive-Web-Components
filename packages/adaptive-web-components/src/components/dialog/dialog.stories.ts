import { html } from "@microsoft/fast-element";
import { DialogClosedBy } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Dialog as DialogElement } from "./dialog.js";

const storyTemplate = html<StoryArgs<DialogElement>>`
    <div>
        <adaptive-button commandfor="example-dialog" command="show-modal">Open dialog</adaptive-button>
        <adaptive-dialog
            id="example-dialog"
            closedby="${(x) => x.closedBy}"
            aria-label="${(x) => x.ariaLabel}"
        >
            ${(x) => x.storyContent}
            <adaptive-button commandfor="example-dialog" command="close">Close</adaptive-button>
        </adaptive-dialog>
    </div>
`;

export default {
    title: "Components/Dialog",
    args: {
        ariaLabel: "Example dialog",
        closedBy: DialogClosedBy.closeRequest,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        ariaLabel: { control: "text" },
        closedBy: { control: "radio", options: Object.values(DialogClosedBy) },
    },
} as Meta<DialogElement>;

export const Dialog: Story<DialogElement> = renderComponent(storyTemplate).bind({});
Dialog.args = {
    storyContent: html`
        <p>Press Escape, or the button, to close.</p>
        <adaptive-checkbox label="A checkbox"></adaptive-checkbox>
        <adaptive-text-field autofocus label="A text field, which takes the focus"></adaptive-text-field>
    `,
};

export const DialogClosedByAny: Story<DialogElement> = renderComponent(storyTemplate).bind({});
DialogClosedByAny.args = {
    closedBy: DialogClosedBy.any,
    storyContent: html`<p>Click outside, or press Escape, to close.</p>`,
};
