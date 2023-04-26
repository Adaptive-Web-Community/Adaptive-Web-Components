import checkmarkIcon from "@fluentui/svg-icons/icons/checkmark_16_regular.svg";
import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import circleIcon from "@fluentui/svg-icons/icons/circle_12_filled.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { composeMenuItem } from "./menu-item.compose.js";
import { MenuItemStatics } from "./menu-item.template.js";
import { styleModules } from "./menu-item.styles.modules.js";

/**
 * The Menu Item custom element definition. Implements {@link @microsoft/fast-foundation#FASTMenuItem}.
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
            [MenuItemStatics.checkbox]: checkmarkIcon,
            [MenuItemStatics.radio]: circleIcon,
            [MenuItemStatics.submenu]: chevronRightIcon
        },
        styleModules,
    }
);
