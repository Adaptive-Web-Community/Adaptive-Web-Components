import { ElementViewTemplate } from "@microsoft/fast-element";
import { anchoredRegionTemplate, FASTAnchoredRegion } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const AnchoredRegionConditions = {
    loaded: "[data-loaded='loaded']",
};

export const AnchoredRegionParts = {
};

export const AnchoredRegionAnatomy: ComponentAnatomy<typeof AnchoredRegionConditions, typeof AnchoredRegionParts> = {
    interactivity: Interactivity.never,
    conditions: AnchoredRegionConditions,
    parts: AnchoredRegionParts,
};

/**
 * Default Anchored Region template, {@link @microsoft/fast-foundation#anchoredRegionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAnchoredRegion> =
    (ds: DesignSystem) =>
        anchoredRegionTemplate();
