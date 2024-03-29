import { DefaultDesignSystem } from "../../design-system.js";
import { composePickerList } from "./picker-list.compose.js";
import { styleModules } from "./picker-list.styles.modules.js";

/**
 * The Picker List custom element definition. Implements {@link @microsoft/fast-foundation#FASTPickerList}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker-list\>
 *
 * @public
 */
export const pickerListDefinition = composePickerList(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
