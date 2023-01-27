import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTRadioGroup, radioGroupTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Radio Group template, {@link @microsoft/fast-foundation#radioGroupTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTRadioGroup> =
    (ds: DesignSystem) =>
        radioGroupTemplate();
