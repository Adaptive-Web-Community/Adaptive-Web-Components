import { chevronDownIcon, dismissIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composePicker } from "./picker.compose.js";
import { styleModules } from "./picker.styles.modules.js";
import { PickerStatics } from "./picker.template.js";

/**
 * The Picker custom element definition. Implements {@link Picker}.
 *
 * @remarks
 * HTML Element: \<adaptive-picker\>
 *
 * @public
 */
export const pickerDefinition = composePicker(
    DefaultDesignSystem,
    {
        statics: {
            [PickerStatics.indicator]: chevronDownIcon,
            [PickerStatics.removeValue]: dismissIcon,
        },
        styleModules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the input.
            delegatesFocus: true,
        },
    }
);
