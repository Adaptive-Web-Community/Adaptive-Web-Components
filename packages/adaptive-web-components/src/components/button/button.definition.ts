import { DefaultDesignSystem } from "../../design-system.js";
import { composeButton } from "./button.compose.js";
import { styleModules } from "./button.styles.modules.js";

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
        styleModules,
    }
);
