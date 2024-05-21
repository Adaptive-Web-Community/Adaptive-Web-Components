import { stylePropertyBorderThicknessAll, stylePropertyCornerRadiusAll } from "../core/modules/types.js";
import { createTokenDimension } from "../core/token-helpers.js";

/** @public */
export const designUnit = createTokenDimension("global.designUnit").withDefault("4px");

/** @public */
export const cornerRadiusControl = createTokenDimension("shape.cornerRadius.default", stylePropertyCornerRadiusAll).withDefault("4px");

// Planning to migrate the radius settings as part of the density system.
/** @public */
export const cornerRadiusLayer = createTokenDimension("density.layer.cornerRadius", stylePropertyCornerRadiusAll).withDefault("8px");

/** @public */
export const strokeThickness = createTokenDimension("shape.strokeThickness.default", stylePropertyBorderThicknessAll).withDefault("1px");

/** @public */
export const focusStrokeThickness = createTokenDimension("shape.strokeThickness.focus", stylePropertyBorderThicknessAll).withDefault("2px");
