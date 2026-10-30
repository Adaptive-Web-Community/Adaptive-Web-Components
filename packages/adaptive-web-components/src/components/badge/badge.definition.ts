import { DefaultDesignSystem } from "../../design-system.js";
import { composeBadge } from "./badge.compose.js";
import { styleRules } from "./badge.styles.rules.js";

/**
 * The Badge custom element definition. Implements {@link Badge}.
 *
 * @remarks
 * HTML Element: \<adaptive-badge\>
 *
 * @public
 */
export const badgeDefinition = composeBadge(
    DefaultDesignSystem,
    {
        styleRules,
    }
);
