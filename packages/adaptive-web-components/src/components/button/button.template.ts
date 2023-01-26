import { ElementViewTemplate } from "@microsoft/fast-element";
import { buttonTemplate, FASTButton } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Button template, {@link @microsoft/fast-foundation#buttonTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTButton> =
    (ds: DesignSystem) =>
        buttonTemplate();
