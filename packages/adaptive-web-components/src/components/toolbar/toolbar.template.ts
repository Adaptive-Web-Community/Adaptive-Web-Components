import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTToolbar, toolbarTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Toolbar template, {@link @microsoft/fast-foundation#toolbarTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTToolbar> =
    (ds: DesignSystem) =>
        toolbarTemplate();
