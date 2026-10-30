import { DefaultDesignSystem } from "../../design-system.js";
import { composeSwitch } from "./switch.compose.js";
import { styleRules } from "./switch.styles.rules.js";

/**
 * The Switch custom element definition. Implements {@link Switch}.
 *
 * @remarks
 * HTML Element: \<adaptive-switch\>
 *
 * @public
 */
export const switchDefinition = composeSwitch(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
