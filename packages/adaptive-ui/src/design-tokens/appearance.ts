import { StyleProperty } from "../modules/types.js";
import { create, createTokenDimension, createTokenNumber } from "./create.js";

/** @public */
export const designUnit = createTokenNumber("design-unit").withDefault(4);

/** @public @deprecated Use `cornerRadiusControl` instead */
export const controlCornerRadius = create<number>("control-corner-radius").withDefault(4);

/** @public */
export const cornerRadiusControl = createTokenDimension("corner-radius-control", StyleProperty.cornerRadius).withDefault("4px");

/** @public @deprecated Use `cornerRadiusLayer` instead */
export const layerCornerRadius = create<number>("layer-corner-radius").withDefault(8);

/** @public */
export const cornerRadiusLayer = createTokenDimension("corner-radius-layer", StyleProperty.cornerRadius).withDefault("8px");

/** @public @deprecated Use `strokeThickness` instead */
export const strokeWidth = create<number>("stroke-width").withDefault(1);

/** @public */
export const strokeThickness = createTokenDimension("stroke-thickness", StyleProperty.borderThickness).withDefault("1px");

/** @public @deprecated Use `focusStrokeThickness` instead */
export const focusStrokeWidth = create<number>("focus-stroke-width").withDefault(2);

/** @public */
export const focusStrokeThickness = createTokenDimension("focus-stroke-thickness", StyleProperty.borderThickness).withDefault("2px");
