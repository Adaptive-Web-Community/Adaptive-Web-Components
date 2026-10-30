import { checkboxIcon, chevronRightIcon, radioIcon } from "../../assets.js";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeMenuItem } from "./menu-item.compose.js";
import { MenuItemStatics } from "./menu-item.template.js";
import { styleRules } from "./menu-item.styles.rules.js";

/**
 * The Menu Item custom element definition. Implements {@link MenuItem}.
 *
 * @remarks
 * HTML Element: \<adaptive-menu-item\>
 *
 * @public
 */
export const menuItemDefinition = composeMenuItem(
    DefaultDesignSystem,
    {
        statics: {
            [MenuItemStatics.checkbox]: checkboxIcon,
            [MenuItemStatics.radio]: radioIcon,
            [MenuItemStatics.submenu]: chevronRightIcon,
        },
        styleRules,
    }
);
