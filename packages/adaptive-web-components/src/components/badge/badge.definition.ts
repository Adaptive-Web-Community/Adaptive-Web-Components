import { DefaultDesignSystem } from "../../design-system.js";
import { composeBadge } from "./badge.compose.js";
import { styleModules } from "./badge.styles.modules.js";

/**
 * The Badge custom element definition. Implements {@link @microsoft/fast-foundation#FASTBadge}.
 *
 * @remarks
 * HTML Element: \<adaptive-badge\>
 *
 * @public
 */
export const badgeDefinition = composeBadge(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
