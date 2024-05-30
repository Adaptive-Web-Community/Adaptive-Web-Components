import { DensityPaddingAndGapTokenGroup } from "../core/density/index.js";
import { designUnit, strokeThickness } from "./appearance.js";

/**
 * @public
 */
export const densityControl = new DensityPaddingAndGapTokenGroup("density.control", 3, 2, 2, 1, designUnit, strokeThickness);

/**
 * @public
 */
export const densityItemContainer = new DensityPaddingAndGapTokenGroup("density.itemContainer", 1, 0, 1, 0, designUnit, strokeThickness);

/**
 * @public
 */
export const densityLayer = new DensityPaddingAndGapTokenGroup("density.layer", 4, 4, 4, 4, designUnit, strokeThickness);
