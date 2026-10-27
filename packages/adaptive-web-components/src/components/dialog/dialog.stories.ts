import { html, ref } from "@microsoft/fast-element";
import { DialogClosedBy } from "@adaptive-web/components-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Dialog as DialogElement } from "./dialog.js";

const storyTemplate = html<StoryArgs<DialogElement>>`
    <div>
        <adaptive-button @click="${(x) => x.dialogRef.showModal()}">Open dialog</adaptive-button>
        <adaptive-dialog
            closedby="${(x) => x.closedBy}"
            aria-label="${(x) => x.ariaLabel}"
            ${ref("dialogRef")}
        >
            ${(x) => x.storyContent}
            <adaptive-button @click="${(x) => x.dialogRef.close()}">Close</adaptive-button>
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
        <adaptive-checkbox>A checkbox</adaptive-checkbox>
        <adaptive-text-field autofocus>A text field, which takes the focus</adaptive-text-field>
    `,
};

export const DialogClosedByAny: Story<DialogElement> = renderComponent(storyTemplate).bind({});
DialogClosedByAny.args = {
    closedBy: DialogClosedBy.any,
    storyContent: html`<p>Click outside, or press Escape, to close.</p>`,
};
