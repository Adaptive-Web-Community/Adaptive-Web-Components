import { DefaultDesignSystem } from "../../design-system.js";
import { composeRadioGroup } from "./radio-group.compose.js";
import { styleRules } from "./radio-group.styles.rules.js";

/**
 * The Radio Group custom element definition. Implements {@link RadioGroup}.
 *
 * @remarks
 * HTML Element: \<adaptive-radio-group\>
 *
 * @public
 */
export const radioGroupDefinition = composeRadioGroup(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
