import { ElementViewTemplate } from "@microsoft/fast-element";
import { anchorTemplate, FASTAnchor } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const AnchorConditions = {
    iconOnly: ".icon-only",
};

export const AnchorParts = {
    control: "control",
    content: "content",
};

export const AnchorAnatomy: ComponentAnatomy<typeof AnchorConditions, typeof AnchorParts> = {
    interactivity: Interactivity.hrefAttribute,
    conditions: AnchorConditions,
    parts: AnchorParts,
};

/**
 * Default Anchor template, {@link @microsoft/fast-foundation#anchorTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAnchor> =
    (ds: DesignSystem) =>
        anchorTemplate();
