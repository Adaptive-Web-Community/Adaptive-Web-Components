import checkmarkIcon from "@fluentui/svg-icons/icons/checkmark_16_regular.svg";
import subtractIcon from "@fluentui/svg-icons/icons/subtract_16_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCheckbox } from './checkbox.compose.js';
import { CheckboxStatics } from "./checkbox.template.js";

/**
 * The Checkbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCheckbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
export const checkboxDefinition = composeCheckbox(
    DefaultDesignSystem,
    {
        statics: {
            [CheckboxStatics.checked]: checkmarkIcon,
            [CheckboxStatics.indeterminate]: subtractIcon
        }
    }
);
