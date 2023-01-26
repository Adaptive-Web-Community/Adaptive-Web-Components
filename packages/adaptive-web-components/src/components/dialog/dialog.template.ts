import { ElementViewTemplate } from "@microsoft/fast-element";
import { dialogTemplate, FASTDialog } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Dialog template, {@link @microsoft/fast-foundation#dialogTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTDialog> =
    (ds: DesignSystem) =>
        dialogTemplate();
