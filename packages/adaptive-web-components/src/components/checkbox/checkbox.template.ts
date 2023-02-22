import { ElementViewTemplate } from "@microsoft/fast-element";
import { checkboxTemplate, FASTCheckbox } from "@microsoft/fast-foundation";
import type { ValuesOf } from '@microsoft/fast-foundation';
import { DesignSystem } from "../../design-system.js";

/**
 * Keys for {@link DesignSystem} `statics` registration for the checkbox.
 */
export const CheckboxStatics = {
    checked: "checkbox-checked-indicator",
    indeterminate: "checkbox-indeterminate-indicator"
} as const;

export type CheckboxStatics = ValuesOf<typeof CheckboxStatics>;

/**
 * Default Checkbox template, {@link @microsoft/fast-foundation#checkboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCheckbox> =
    (ds: DesignSystem) => {
        return checkboxTemplate({
            checkedIndicator: ds.statics.get(CheckboxStatics.checked),
            indeterminateIndicator: ds.statics.get(CheckboxStatics.indeterminate),
        });
    }
