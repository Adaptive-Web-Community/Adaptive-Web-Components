import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTMenu, menuTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Menu template, {@link @microsoft/fast-foundation#menuTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTMenu> =
    (ds: DesignSystem) =>
        menuTemplate();
