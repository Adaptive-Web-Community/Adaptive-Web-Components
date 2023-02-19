import { DefaultDesignSystem } from "../../design-system.js";
import { composeAnchoredRegion } from "./anchored-region.compose.js";

/**
 * The Anchored Region custom element definition. Implements {@link @microsoft/fast-foundation#FASTAnchoredRegion}.
 *
 * @remarks
 * HTML Element: \<adaptive-anchored-region\>
 *
 * @public
 */
export const anchoredRegionDefinition = composeAnchoredRegion(DefaultDesignSystem);
