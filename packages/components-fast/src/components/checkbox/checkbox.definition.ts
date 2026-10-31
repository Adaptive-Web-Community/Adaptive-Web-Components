import { checkboxIcon, checkboxIndeterminateIcon } from "@adaptive-web/components-foundation";
import type { ComponentDefinition } from "../../design-system.js";
import { composeCheckbox } from './checkbox.compose.js';
import { CheckboxStatics } from "./checkbox.template.js";
import { styleRules } from "./checkbox.styles.rules.js";

/**
 * The Checkbox custom element definition. Implements {@link Checkbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-checkbox\>
 *
 * @public
 */
export const checkboxDefinition: ComponentDefinition = ds => composeCheckbox(
    ds,
    {
        statics: {
            [CheckboxStatics.checked]: checkboxIcon,
            [CheckboxStatics.indeterminate]: checkboxIndeterminateIcon,
        },
        styleRules,
    }
);
