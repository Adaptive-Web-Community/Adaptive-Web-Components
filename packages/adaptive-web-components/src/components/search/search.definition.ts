import { DefaultDesignSystem } from "../../design-system.js";
import { composeSearch } from "./search.compose.js";
import { styleModules } from "./search.styles.modules.js";

/**
 * The Search Field custom element definition. Implements {@link Search}.
 *
 * @remarks
 * HTML Element: \<adaptive-search\>
 *
 * @public
 */
export const searchDefinition = composeSearch(
    DefaultDesignSystem,
    {
        styleModules,
        shadowOptions: {
            // Focusing the element, or a label of it, focuses the native control.
            delegatesFocus: true,
        },
    }
);
