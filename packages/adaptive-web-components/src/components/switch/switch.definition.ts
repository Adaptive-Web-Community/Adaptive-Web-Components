import { DefaultDesignSystem } from "../../design-system.js";
import { composeSwitch } from "./switch.compose.js";

/**
 * The Switch custom element definition. Implements {@link @microsoft/fast-foundation#FASTSwitch}.
 *
 * @remarks
 * HTML Element: \<adaptive-switch\>
 *
 * @public
 */
export const switchDefinition = composeSwitch(DefaultDesignSystem);