import { DefaultDesignSystem } from "../../design-system.js";
import { composePicker } from "./picker.compose.js";
import { styleModules } from "./picker.styles.modules.js";

/**
 * The Picker custom element definition. Implements {@link @microsoft/fast-foundation#FASTPicker}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker\>
 *
 * @public
 */
export const pickerDefinition = composePicker(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
