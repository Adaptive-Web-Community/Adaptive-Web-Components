import { DefaultDesignSystem } from "../../design-system.js";
import { composePickerMenu } from "./picker-menu.compose.js";
import { styleModules } from "./picker-menu.styles.modules.js";

/**
 * The Picker Menu custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerMenu}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-menu\>
 *
 * @public
 */
export const pickerMenuDefinition = composePickerMenu(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
