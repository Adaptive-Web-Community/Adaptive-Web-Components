import { chevronDownIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeSelect } from "./select.compose.js";
import { SelectStatics } from "./select.template.js";
import { styleModules } from "./select.styles.modules.js";

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
            [SelectStatics.indicator]: chevronDownIcon,
        },
        styleModules,
    }
);
