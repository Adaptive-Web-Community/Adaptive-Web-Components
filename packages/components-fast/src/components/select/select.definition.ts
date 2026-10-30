import { chevronDownIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeSelect } from "./select.compose.js";
import { SelectStatics } from "./select.template.js";
import { styleRules } from "./select.styles.rules.js";

/**
 * The Select custom element definition. Implements {@link Select}.
 *
 * @remarks
 * HTML Element: \<adaptive-select\>
 *
 * @public
 */
export const selectDefinition = composeSelect(
    DefaultDesignSystem,
    {
        statics: {
            [SelectStatics.indicator]: chevronDownIcon,
        },
        styleRules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the combobox.
            delegatesFocus: true,
        },
    }
);
