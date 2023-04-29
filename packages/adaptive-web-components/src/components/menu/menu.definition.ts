import { DefaultDesignSystem } from "../../design-system.js";
import { composeMenu } from "./menu.compose.js";
import { styleModules } from "./menu.styles.modules.js";

/**
 * The Menu custom element definition. Implements {@link @microsoft/fast-foundation#FASTMenu}.
 *
 * @remarks
 * HTML Element: \<adaptive-menu\>
 *
 * @public
 */
export const menuDefinition = composeMenu(
    DefaultDesignSystem,
    {
        styleModules,
    }
);
