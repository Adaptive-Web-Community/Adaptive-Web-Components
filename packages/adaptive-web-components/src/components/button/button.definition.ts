import { DefaultDesignSystem } from "../../design-system.js";
import { composeButton } from "./button.compose.js";
import { styleRules } from "./button.styles.rules.js";

/**
 * The Button custom element definition. Implements {@link Button}.
 *
 * @remarks
 * HTML Element: \<adaptive-button\>
 *
 * @public
 */
export const buttonDefinition = composeButton(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
