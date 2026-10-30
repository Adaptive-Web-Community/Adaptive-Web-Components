import { DefaultDesignSystem } from "../../design-system.js";
import { composeListbox } from "./listbox.compose.js";
import { styleRules } from "./listbox.styles.rules.js";

/**
 * The Listbox custom element definition. Implements {@link Listbox}.
 *
 * @remarks
 * HTML Element: \<adaptive-listbox\>
 *
 * @public
 */
export const listboxDefinition = composeListbox(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
