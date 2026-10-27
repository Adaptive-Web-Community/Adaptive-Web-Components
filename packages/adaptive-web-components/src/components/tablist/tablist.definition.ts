import { DefaultDesignSystem } from "../../design-system.js";
import { composeTablist } from "./tablist.compose.js";
import { styleModules } from "./tablist.styles.modules.js";

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
        styleModules,
    }
);
