import { chevronDownIcon, chevronUpIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeNumberField } from "./number-field.compose.js";
import { NumberFieldStatics } from "./number-field.template.js";
import { styleRules } from "./number-field.styles.rules.js";

/**
 * The Number Field custom element definition. Implements {@link NumberField}.
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
            [NumberFieldStatics.stepDown]: chevronDownIcon,
            [NumberFieldStatics.stepUp]: chevronUpIcon,
        },
        styleRules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the native control.
            delegatesFocus: true,
        },
    }
);
