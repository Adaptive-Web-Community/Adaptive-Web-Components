import checkmarkIcon from "@fluentui/svg-icons/icons/checkmark_16_regular.svg";
import chevronRightIcon from "@fluentui/svg-icons/icons/chevron_right_12_regular.svg";
import circleIcon from "@fluentui/svg-icons/icons/circle_12_filled.svg";
import { DefaultDesignSystem } from "../../design-system.js";
import { definition } from "./menu-item.definition.js";
import {
    MenuItemCheckboxIndicatorKey,
    MenuItemRadioIndicatorKey,
    MenuItemSubmenuIconKey,
} from "./menu-item.template.js";

if (!DefaultDesignSystem.statics.has(MenuItemCheckboxIndicatorKey)) {
    DefaultDesignSystem.statics.set(MenuItemCheckboxIndicatorKey, checkmarkIcon);
}
if (!DefaultDesignSystem.statics.has(MenuItemRadioIndicatorKey)) {
    DefaultDesignSystem.statics.set(MenuItemRadioIndicatorKey, circleIcon);
}
if (!DefaultDesignSystem.statics.has(MenuItemSubmenuIconKey)) {
    DefaultDesignSystem.statics.set(MenuItemSubmenuIconKey, chevronRightIcon);
}

definition(DefaultDesignSystem).define();
