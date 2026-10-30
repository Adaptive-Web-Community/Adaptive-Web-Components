import { html, repeat } from "@microsoft/fast-element";
import { renderComponent } from "../../utilities/storybook-helpers.js";
import type { Meta, Story, StoryArgs } from "../../utilities/storybook-helpers.js";
import type { Checkbox as CheckboxElement } from "./checkbox.js";

const storyTemplate = html<StoryArgs<CheckboxElement>>`
    <adaptive-checkbox
        label="${(x) => x.label}"
        ?hide-label="${(x) => x.hideLabel}"
        ?checked="${(x) => x.checked}"
        ?disabled="${(x) => x.disabled}"
        :indeterminate="${(x) => x.indeterminate}"
        ?readonly="${(x) => x.readOnly}"
        ?required="${(x) => x.required}"
        value="${(x) => x.value}"
    >
        ${(x) => x.storyContent}
    </adaptive-checkbox>
`;

export default {
    title: "Components/Checkbox",
    args: {
        label: "Checkbox",
        checked: false,
        disabled: false,
        indeterminate: false,
        required: false,
    },
    argTypes: {
        storyContent: { table: { disable: true } },
        label: { control: "text" },
        hideLabel: { control: "boolean" },
        storyItems: { table: { disable: true } },
        checked: { control: "boolean" },
        disabled: { control: "boolean" },
        indeterminate: { control: "boolean" },
        readOnly: { control: "boolean" },
        required: { control: "boolean" },
        value: { control: "text" },
    },
} as Meta<CheckboxElement>;

export const Checkbox: Story<CheckboxElement> = renderComponent(storyTemplate).bind({});

export const CheckboxDisabled: Story<CheckboxElement> = renderComponent(
    html<StoryArgs<CheckboxElement>>`
        <div style="align-items: start; display: flex; flex-direction: column; gap: 8px;">
            ${repeat((x) => x.storyItems, storyTemplate)}
        </div>
    `
).bind({});
CheckboxDisabled.args = {
    storyItems: [
        { label: "Disabled (unchecked)", disabled: true },
        {
            label: "Disabled (indeterminate, unchecked)",
            disabled: true,
            indeterminate: true,
        },
        {
            label: "Disabled (indeterminate, checked)",
            checked: true,
            disabled: true,
            indeterminate: true,
        },
        { label: "Disabled (checked)", checked: true, disabled: true },
    ],
};

export const CheckboxIndeterminate: Story<CheckboxElement> = Checkbox.bind({});
CheckboxIndeterminate.args = {
    checked: true,
    indeterminate: true,
    label: "Indeterminate",
};

export const CheckboxInForm: Story<CheckboxElement> = renderComponent(
    html<StoryArgs<CheckboxElement>>`
        <form @submit="${() => false}">
            ${storyTemplate}
            <adaptive-button type="submit">Submit</adaptive-button>
        </form>
    `
).bind({});

export const CheckboxInFieldset: Story<CheckboxElement> = renderComponent(
    html<StoryArgs<CheckboxElement>>`
        <fieldset style="align-items: start; display: flex; flex-direction: column; gap: 8px;">
            <legend>${(x) => x.legendLabel}</legend>
            ${repeat((x) => x.storyItems, storyTemplate)}
        </fieldset>
    `
).bind({});
CheckboxInFieldset.args = {
    legendLabel: "Fruit",
    storyItems: [
        { label: "Apples", checked: true },
        { label: "Bananas", checked: true },
        { label: "Honeydew" },
        { label: "Oranges", checked: true },
    ],
};

export const CheckboxVisualVsAudioLabel = Checkbox.bind({});
CheckboxVisualVsAudioLabel.args = {
    storyContent: html`
        <span slot="label" aria-label="Audio label">Visible label</span>
    `,
};
