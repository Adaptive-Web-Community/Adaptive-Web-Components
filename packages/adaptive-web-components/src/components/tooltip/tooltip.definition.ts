import { DefaultDesignSystem } from "../../design-system.js";
import { composeTooltip } from "./tooltip.compose.js";
import { styleModules } from "./tooltip.styles.modules.js";

/**
 * The Tooltip custom element definition. Implements {@link Tooltip}.
 *
 * @remarks
 * HTML Element: \<adaptive-tooltip\>
 *
 * @public
 */
export const tooltipDefinition = composeTooltip(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
