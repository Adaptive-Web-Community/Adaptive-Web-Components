import { html } from "@microsoft/fast-element";
import { ButtonType } from "@adaptive-web/components-foundation";
import { maybeEndSlotIcon, maybeStartSlotIcon, renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Button as ButtonElement } from "./button.js";

export const storyTemplate = html<StoryArgs<ButtonElement>>`
    <adaptive-button
        ?autofocus="${(x) => x.autofocus}"
        ?disabled="${(x) => x.disabled}"
        form="${(x) => x.formId}"
        formaction="${(x) => x.formAction}"
        formenctype="${(x) => x.formEnctype}"
        formmethod="${(x) => x.formMethod}"
        ?formnovalidate="${(x) => x.formNoValidate}"
        formtarget="${(x) => x.formTarget}"
        name="${(x) => x.name}"
        type="${(x) => x.type}"
        value="${(x) => x.value}"
        aria-atomic="${(x) => x.ariaAtomic}"
        aria-busy="${(x) => x.ariaBusy}"
        aria-controls="${(x) => x.ariaControls}"
        aria-current="${(x) => x.ariaCurrent}"
        aria-describedby="${(x) => x.ariaDescribedby}"
        aria-details="${(x) => x.ariaDetails}"
        aria-disabled="${(x) => x.ariaDisabled}"
        aria-errormessage="${(x) => x.ariaErrormessage}"
        aria-expanded="${(x) => x.ariaExpanded}"
        aria-flowto="${(x) => x.ariaFlowto}"
        aria-haspopup="${(x) => x.ariaHaspopup}"
        aria-hidden="${(x) => x.ariaHidden}"
        aria-invalid="${(x) => x.ariaInvalid}"
        aria-keyshortcuts="${(x) => x.ariaKeyshortcuts}"
        aria-label="${(x) => x.ariaLabel}"
        aria-labelledby="${(x) => x.ariaLabelledby}"
        aria-live="${(x) => x.ariaLive}"
        aria-owns="${(x) => x.ariaOwns}"
        aria-pressed="${(x) => x.ariaPressed}"
        aria-relevant="${(x) => x.ariaRelevant}"
        aria-roledescription="${(x) => x.ariaRoledescription}"
    >
        ${(x) => maybeStartSlotIcon(x)}
        ${(x) => x.storyContent}
        ${(x) => maybeEndSlotIcon(x)}
    </adaptive-button>
`;

export default {
    title: "Components/Button",
    includeStories: ["Button", "ButtonIconOnly"],
    args: {
        startSlotIcon: false,
        endSlotIcon: false,
        storyContent: "Button",
        disabled: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        autofocus: { control: "boolean" },
        disabled: { control: "boolean" },
        formId: { control: "text" },
        formAction: { control: "text" },
        formEnctype: { control: "text" },
        formMethod: { control: "text" },
        formNoValidate: { control: "boolean" },
        formTarget: { control: "text" },
        name: { control: "text" },
        type: { control: "select", options: Object.values(ButtonType) },
        value: { control: "text" },
        ariaAtomic: { control: "text" },
        ariaBusy: { control: "text" },
        ariaControls: { control: "text" },
        ariaCurrent: { control: "text" },
        ariaDescribedby: { control: "text" },
        ariaDetails: { control: "text" },
        ariaDisabled: { control: "text" },
        ariaErrormessage: { control: "text" },
        ariaExpanded: { control: "text" },
        ariaFlowto: { control: "text" },
        ariaHaspopup: { control: "text" },
        ariaHidden: { control: "text" },
        ariaInvalid: { control: "text" },
        ariaKeyshortcuts: { control: "text" },
        ariaLabel: { control: "text" },
        ariaLabelledby: { control: "text" },
        ariaLive: { control: "text" },
        ariaOwns: { control: "text" },
        ariaPressed: { control: "text" },
        ariaRelevant: { control: "text" },
        ariaRoledescription: { control: "text" },
    },
} as Meta<ButtonElement>;

export const Button: Story<ButtonElement> = renderComponent(storyTemplate).bind({});

export const ButtonIconOnly: Story<ButtonElement> = Button.bind({});
ButtonIconOnly.args = {
    storyContent: html`
        <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.26 4.6a5.21 5.21 0 0 1 9.03 5.22l-.2.34a.5.5 0 0 1-.67.19l-3.47-2-1.93 3.38c1.34.4 2.5 1.33 3.31 2.52h-.09c-.34 0-.66.11-.92.31A4.9 4.9 0 0 0 9.5 12.5a4.9 4.9 0 0 0-3.82 2.06 1.5 1.5 0 0 0-1.01-.3 5.94 5.94 0 0 1 5.31-2.74l2.1-3.68-3.83-2.2a.5.5 0 0 1-.18-.7l.2-.33Zm.92.42 1.7.98.02-.02a8.08 8.08 0 0 1 3.27-2.74 4.22 4.22 0 0 0-4.99 1.78ZM14 7.8c.47-.82.7-1.46.77-2.09a5.8 5.8 0 0 0-.06-1.62 6.96 6.96 0 0 0-2.95 2.41L14 7.8Zm.87.5 1.61.93a4.22 4.22 0 0 0-.74-5.02c.07.56.09 1.1.02 1.63-.1.79-.38 1.56-.89 2.46Zm-9.63 7.3a.5.5 0 0 0-.96.03c-.17.7-.5 1.08-.86 1.3-.38.23-.87.32-1.42.32a.5.5 0 0 0 0 1c.64 0 1.33-.1 1.94-.47.34-.2.64-.5.88-.87a2.96 2.96 0 0 0 4.68-.01 2.96 2.96 0 0 0 4.74-.06c.64.9 1.7 1.41 2.76 1.41a.5.5 0 1 0 0-1c-.98 0-1.96-.64-2.29-1.65a.5.5 0 0 0-.95 0 1.98 1.98 0 0 1-3.79.07.5.5 0 0 0-.94 0 1.98 1.98 0 0 1-3.8-.08Z"/>
        </svg>
    `,
};
