import { ElementViewTemplate } from "@microsoft/fast-element";
import { anchorTemplate, FASTAnchor } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Anchor template, {@link @microsoft/fast-foundation#anchorTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAnchor> =
    (ds: DesignSystem) =>
        anchorTemplate();
