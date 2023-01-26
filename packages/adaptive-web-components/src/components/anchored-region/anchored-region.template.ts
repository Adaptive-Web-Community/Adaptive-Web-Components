import { ElementViewTemplate } from "@microsoft/fast-element";
import { anchoredRegionTemplate, FASTAnchoredRegion } from "@microsoft/fast-foundation";
import { DesignSystem } from "../../design-system.js";

/**
 * Default Anchored Region template, {@link @microsoft/fast-foundation#anchoredRegionTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTAnchoredRegion> =
    (ds: DesignSystem) =>
        anchoredRegionTemplate();
