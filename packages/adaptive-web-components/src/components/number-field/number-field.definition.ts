import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import chevronUpIcon from "@fluentui/svg-icons/icons/chevron_up_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeNumberField } from "./number-field.compose.js";
import { NumberFieldStatics } from "./number-field.template.js";
import { styleModules } from "./number-field.styles.modules.js";

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
            [NumberFieldStatics.stepDown]: chevronDownIcon,
            [NumberFieldStatics.stepUp]: chevronUpIcon
        },
        styleModules,
    }
);
