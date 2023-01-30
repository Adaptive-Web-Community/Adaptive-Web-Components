import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTab, tabTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Tab template, {@link @microsoft/fast-foundation#tabTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTab> =
    (ds: DesignSystem) =>
        tabTemplate();
