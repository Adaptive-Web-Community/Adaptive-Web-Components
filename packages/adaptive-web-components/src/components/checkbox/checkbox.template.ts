import { ElementViewTemplate } from "@microsoft/fast-element";
import { checkboxTemplate, FASTCheckbox } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Key for {@link DesignSystem} `statics` registration for the checkbox checked indicator.
 */
export const CheckboxCheckedIndicatorKey: string = "checkbox-checked-indicator";

/**
 * Key for {@link DesignSystem} `statics` registration for the checkbox indeterminate indicator.
 */
export const CheckboxIndeterminateIndicatorKey: string = "checkbox-indeterminate-indicator";

/**
 * Default Checkbox template, {@link @microsoft/fast-foundation#checkboxTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTCheckbox> =
    (ds: DesignSystem) => {
        return checkboxTemplate({
            checkedIndicator: ds.statics.get(CheckboxCheckedIndicatorKey),
            indeterminateIndicator: ds.statics.get(CheckboxIndeterminateIndicatorKey),
        });
    }
