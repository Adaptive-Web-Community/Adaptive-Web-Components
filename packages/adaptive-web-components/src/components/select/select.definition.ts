import chevronDownIcon from "@fluentui/svg-icons/icons/chevron_down_12_regular.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeSelect } from "./select.compose.js";
import { SelectIconKeys } from "./select.template.js";

/**
 * The select custom element definition. Implements {@link @microsoft/fast-foundation#FASTSelect}.
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
            [SelectIconKeys.indicator]: chevronDownIcon
        }
    }
);