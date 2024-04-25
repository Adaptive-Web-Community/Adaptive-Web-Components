import { stylePropertyBorderThicknessAll, stylePropertyCornerRadiusAll } from "../core/modules/types.js";
import { createTokenDimension } from "../core/token-helpers.js";

/** @public */
export const designUnit = createTokenDimension("design-unit").withDefault("4px");

/** @public */
export const cornerRadiusControl = createTokenDimension("corner-radius-control", stylePropertyCornerRadiusAll).withDefault("4px");

/** @public */
export const cornerRadiusLayer = createTokenDimension("corner-radius-layer", stylePropertyCornerRadiusAll).withDefault("8px");

/** @public */
export const strokeThickness = createTokenDimension("stroke-thickness", stylePropertyBorderThicknessAll).withDefault("1px");

/** @public */
export const focusStrokeThickness = createTokenDimension("focus-stroke-thickness", stylePropertyBorderThicknessAll).withDefault("2px");
