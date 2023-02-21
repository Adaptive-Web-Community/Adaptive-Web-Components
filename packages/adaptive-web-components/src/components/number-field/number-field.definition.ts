import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeNumberField } from "./number-field.compose.js";
import { NumberFieldIconKeys } from "./number-field.template.js";

/**
 * The Number Field custom element definition. Implements {@link @microsoft/fast-foundation#FASTNumberField}.
 *
 * @remarks
 * HTML Element: \<adaptive-number-field\>
 *
 * @public
 */
export const numberFieldDefinition = composeNumberField(
    DefaultDesignSystem,
    {
        statics: {
            [NumberFieldIconKeys.stepDown]: chevronDownIcon,
            [NumberFieldIconKeys.stepUp]: chevronUpIcon
        },
        shadowOptions: {
            delegatesFocus: true
        }
    }
);