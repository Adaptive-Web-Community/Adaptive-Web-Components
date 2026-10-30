import { DefaultDesignSystem } from "../../design-system.js";
import { composeTextArea } from "./text-area.compose.js";
import { styleRules } from "./text-area.styles.rules.js";

/**
 * The Text Area custom element definition. Implements {@link TextArea}.
 *
 * @remarks
 * HTML Element: \<adaptive-text-area\>
 *
 * @public
 */
export const textAreaDefinition = composeTextArea(
    DefaultDesignSystem,
    {
        styleRules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the native control.
            delegatesFocus: true,
        },
    }
);
