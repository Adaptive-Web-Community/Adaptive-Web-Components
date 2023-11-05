import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { checkboxTemplate } from "@microsoft/fast-foundation";

/**
 * @public
 */
export const CheckboxConditions = {
    checked: "[aria-checked='true']",
    indeterminate: "[aria-checked='mixed']"
};

/**
 * @public
 */
export const CheckboxParts = {
    control: "control",
    label: "label"
};

/**
 * @public
 */
export const CheckboxAnatomy: ComponentAnatomy<typeof CheckboxConditions, typeof CheckboxParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: CheckboxConditions,
    parts: CheckboxParts,
    focus: Focus.hostFocused(),
};

export {
    checkboxTemplate
};