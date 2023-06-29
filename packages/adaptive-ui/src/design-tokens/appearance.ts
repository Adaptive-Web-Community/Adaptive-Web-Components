import { stylePropertyBorderThicknessAll, stylePropertyCornerRadiusAll } from "../modules/types.js";
import { create, createTokenDimension, createTokenNumber } from "../token-helpers.js";

/** @public @deprecated This is changing to a `dimension` type like `4px`, which breaks non-modular styling. See designUnitDimension */
export const designUnit = createTokenNumber("design-unit").withDefault(4);

/** @public @deprecated This is the new `dimension` type, but the name will go back to `designUnit` after the modular styling conversion. */
export const designUnitDimension = createTokenDimension("design-unit-dimension").withDefault("4px");

/** @public @deprecated Use `cornerRadiusControl` instead */
export const controlCornerRadius = create<number>("control-corner-radius").withDefault(4);

/** @public */
export const cornerRadiusControl = createTokenDimension("corner-radius-control", stylePropertyCornerRadiusAll).withDefault("4px");

/** @public @deprecated Use `cornerRadiusLayer` instead */
export const layerCornerRadius = create<number>("layer-corner-radius").withDefault(8);

/** @public */
export const cornerRadiusLayer = createTokenDimension("corner-radius-layer", stylePropertyCornerRadiusAll).withDefault("8px");

/** @public @deprecated Use `strokeThickness` instead */
export const strokeWidth = create<number>("stroke-width").withDefault(1);

/** @public */
export const strokeThickness = createTokenDimension("stroke-thickness", stylePropertyBorderThicknessAll).withDefault("1px");

/** @public @deprecated Use `focusStrokeThickness` instead */
export const focusStrokeWidth = create<number>("focus-stroke-width").withDefault(2);

/** @public */
export const focusStrokeThickness = createTokenDimension("focus-stroke-thickness", stylePropertyBorderThicknessAll).withDefault("2px");
