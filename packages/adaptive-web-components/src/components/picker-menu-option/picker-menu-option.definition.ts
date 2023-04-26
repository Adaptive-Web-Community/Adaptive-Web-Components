import { DefaultDesignSystem } from "../../design-system.js";
import { composePickerMenuOption } from "./picker-menu-option.compose.js";
import { styleModules } from "./picker-menu-option.styles.modules.js";

/**
 * The Picker Menu Option custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerMenuOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-menu-option\>
 *
 * @public
 */
export const pickerMenuOptionDefinition = composePickerMenuOption(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
