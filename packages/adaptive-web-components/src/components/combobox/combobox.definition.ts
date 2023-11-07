import { chevronDownIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCombobox } from "./combobox.compose.js";
import { ComboboxStatics } from "./combobox.template.js";
import { styleModules } from "./combobox.styles.modules.js";

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
            [ComboboxStatics.indicator]: chevronDownIcon,
        },
        styleModules,
    }
);
