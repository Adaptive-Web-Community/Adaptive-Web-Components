import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCombobox } from "./combobox.compose.js";
import { ComboboxStatics } from "./combobox.template.js";

/**
 * The Combobox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCombobox}.
 *
 * @remarks
 * HTML Element: \<adaptive-combobox\>
 *
 * @public
 */
export const comboboxDefinition = composeCombobox(
    DefaultDesignSystem,
    {
        statics: {
            [ComboboxStatics.indicator]: chevronDownIcon
        },
        shadowOptions: {
            delegatesFocus: true
        }
    }
);
