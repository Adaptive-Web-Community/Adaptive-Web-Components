import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTextArea, textAreaTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Text Area template, {@link @microsoft/fast-foundation#textAreaTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTextArea> =
    (ds: DesignSystem) =>
        textAreaTemplate();
