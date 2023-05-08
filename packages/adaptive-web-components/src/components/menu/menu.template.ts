import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTMenu, menuTemplate } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const MenuConditions = {
    submenu: "[slot='submenu']",
};

/**
 * @public
 */
export const MenuParts = {
};

/**
 * @public
 */
export const MenuAnatomy: ComponentAnatomy<typeof MenuConditions, typeof MenuParts> = {
    interactivity: Interactivity.never,
    conditions: MenuConditions,
    parts: MenuParts,
};

/**
 * Default Menu template, {@link @microsoft/fast-foundation#menuTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTMenu> =
    (ds: DesignSystem) =>
        menuTemplate();
