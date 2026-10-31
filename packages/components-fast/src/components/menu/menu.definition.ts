import type { ComponentDefinition } from "../../design-system.js";
import { composeMenu } from "./menu.compose.js";
import { styleRules } from "./menu.styles.rules.js";

/**
 * The Menu custom element definition. Implements {@link Menu}.
 *
 * @remarks
 * HTML Element: \<adaptive-menu\>
 *
 * @public
 */
export const menuDefinition: ComponentDefinition = ds => composeMenu(
    ds,
    {
        styleRules,
    }
);
