import { DefaultDesignSystem } from "../../design-system.js";
import { composePickerMenuOption } from "./picker-menu-option.compose.js";

/**
 * The Picker Menu Option custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerMenuOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-menu-option\>
 *
 * @public
 */
export const pickerMenuOptionDefinition = composePickerMenuOption(DefaultDesignSystem);