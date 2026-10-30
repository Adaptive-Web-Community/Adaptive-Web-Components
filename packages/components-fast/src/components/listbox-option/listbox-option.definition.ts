import { DefaultDesignSystem } from "../../design-system.js";
import { composeListboxOption } from "./listbox-option.compose.js";
import { styleRules } from "./listbox-option.styles.rules.js";

/**
 * The option custom element definition. Implements {@link ListboxOption}.
 *
 * @remarks
 * HTML Element: \<adaptive-option\>
 *
 * @public
 */
export const listboxOptionDefinition = composeListboxOption(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
