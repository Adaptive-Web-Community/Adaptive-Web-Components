import { ElementViewTemplate } from "@microsoft/fast-element";
import { anchorTemplate, FASTAnchor } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const AnchorConditions = {
    iconOnly: ".icon-only",
};

/**
 * @public
 */
export const AnchorParts = {
    control: "control",
    content: "content",
};

/**
 * @public
 */
export const AnchorAnatomy: ComponentAnatomy<typeof AnchorConditions, typeof AnchorParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: AnchorConditions,
    parts: AnchorParts,
};

/**
 * Default Anchor template, {@link @microsoft/fast-foundation#anchorTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAnchor> =
    (ds: DesignSystem) =>
        anchorTemplate();
