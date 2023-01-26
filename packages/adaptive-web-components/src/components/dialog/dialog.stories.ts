import { html, ref } from "@microsoft/fast-element";
import type { FASTDialog } from "@microsoft/fast-foundation";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";

const storyTemplate = html<StoryArgs<FASTDialog>>`
    <adaptive-dialog
        ?hidden="${(x) => x.hidden}"
        ?modal="${(x) => x.modal}"
        ?no-focus-trap="${(x) => x.noFocusTrap}"
        :ariaDescribedby="${(x) => x.ariaDescribedby}"
        :ariaLabel="${(x) => x.ariaLabel}"
        :ariaLabelledby="${(x) => x.ariaLabelledby}"
    >
        ${(x) => x.storyContent}
    </adaptive-dialog>
`;

export default {
    title: "Components/Dialog",
    argTypes: {
        storyContent: { table: { disable: true } },
        hidden: { control: "boolean" },
        modal: { control: "boolean" },
        noFocusTrap: { control: "boolean" },
        ariaDescribedby: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
    },
    // docs are disabled since the modals would all load at once on the docs page
    parameters: {
        docs: { disable: true },
    },
} as Meta<FASTDialog>;

export const Dialog: Story<FASTDialog> = renderComponent(storyTemplate).bind({});
Dialog.args = {
    storyContent: html`
        <adaptive-button>Button A</adaptive-button>
        <button>Button B</button>
        <adaptive-checkbox>A checkbox</adaptive-checkbox>
        <adaptive-toolbar>
            <adaptive-button>One</adaptive-button>
            <adaptive-button>Three</adaptive-button>
        </adaptive-toolbar>
    `,
};

export const DialogModal: Story<FASTDialog> = renderComponent(storyTemplate).bind({});
DialogModal.args = {
    modal: true,
    storyContent: "A modal dialog element",
};

export const DialogWithDismiss: Story<FASTDialog> = renderComponent(
    html<StoryArgs<FASTDialog>>`
        <div>
            <adaptive-button @click="${(x) => x.dialogRef.show()}" class="show-dialog"> Show dialog </adaptive-button>
            <adaptive-dialog
                ?modal="${(x) => x.modal}"
                ?no-focus-trap="${(x) => x.noFocusTrap}"
                @dismiss="${(x) => x.dialogRef.hide()}"
                ${ref("dialogRef")}
            >
                ${(x) => x.storyContent}
            </adaptive-dialog>
        </div>
    `
).bind({});
DialogWithDismiss.args = {
    modal: true,
    storyContent: html`
        <p>Press Escape or click the button below to close</p>
        <adaptive-button @click="${(x) => x.dialogRef.hide()}" class="hide-dialog">Dismiss dialog</adaptive-button>
    `,
};
