import { DefaultDesignSystem } from "../../design-system.js";
import { composeTextField } from "./text-field.compose.js";
import { styleRules } from "./text-field.styles.rules.js";

/**
 * The Text Field custom element definition. Implements {@link TextField}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-field\>
 *
 * @public
 */
export const textFieldDefinition = composeTextField(
    DefaultDesignSystem,
    {
        styleRules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the native control.
            delegatesFocus: true,
        },
    }
);
