import { ElementViewTemplate } from "@microsoft/fast-element";
import { checkboxTemplate, FASTCheckbox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { ComponentAnatomy, Focus, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the checkbox.
 *
 * @beta
 */
export const CheckboxStatics = {
    checked: "checkbox-checked-indicator",
    indeterminate: "checkbox-indeterminate-indicator"
} as const;

/**
 * @beta
 */
export type CheckboxStatics = ValuesOf<typeof CheckboxStatics>;

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

/**
 * Default Checkbox template, {@link @microsoft/fast-foundation#checkboxTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCheckbox> =
    (ds: DesignSystem) => {
        return checkboxTemplate({
            checkedIndicator: ds.statics.get(CheckboxStatics.checked),
            indeterminateIndicator: ds.statics.get(CheckboxStatics.indeterminate),
        });
    }
