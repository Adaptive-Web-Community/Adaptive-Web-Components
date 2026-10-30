import { DefaultDesignSystem } from "../../design-system.js";
import { composeTablist } from "./tablist.compose.js";
import { styleRules } from "./tablist.styles.rules.js";

/**
 * The Tablist custom element definition. Implements {@link Tablist}.
 *
 * @remarks
 * HTML Element: \<adaptive-tablist\>
 *
 * @public
 */
export const tablistDefinition = composeTablist(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
