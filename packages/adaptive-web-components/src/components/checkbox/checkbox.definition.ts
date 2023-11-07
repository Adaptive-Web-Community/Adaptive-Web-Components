import { checkboxIcon, checkboxIndeterminateIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeCheckbox } from './checkbox.compose.js';
import { CheckboxStatics } from "./checkbox.template.js";
import { styleModules } from "./checkbox.styles.modules.js";

/**
 * The Checkbox custom element definition. Implements {@link @microsoft/fast-foundation#FASTCheckbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
export const checkboxDefinition = composeCheckbox(
    DefaultDesignSystem,
    {
        statics: {
            [CheckboxStatics.checked]: checkboxIcon,
            [CheckboxStatics.indeterminate]: checkboxIndeterminateIcon,
        },
        styleModules,
    }
);
