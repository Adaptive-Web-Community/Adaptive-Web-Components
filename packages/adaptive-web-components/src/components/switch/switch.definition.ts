import { DefaultDesignSystem } from "../../design-system.js";
import { composeSwitch } from "./switch.compose.js";
import { styleModules } from "./switch.styles.modules.js";

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
        styleModules,
    }
);
