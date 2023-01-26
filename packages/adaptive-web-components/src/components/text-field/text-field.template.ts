import { ElementViewTemplate } from "@microsoft/fast-element";
import { FASTTextField, textFieldTemplate } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Text Field template, {@link @microsoft/fast-foundation#textFieldTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTTextField> =
    (ds: DesignSystem) =>
        textFieldTemplate();
