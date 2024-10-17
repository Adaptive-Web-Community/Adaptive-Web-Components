import { StylePropertyShorthand } from "../core/modules/types.js";
import { createTokenDimension } from "../core/token-helpers.js";

/** @public */
export const designUnit = createTokenDimension("global.designUnit").withDefault("4px");

/** @public */
export const cornerRadiusControl = createTokenDimension("shape.cornerRadius.default", StylePropertyShorthand.cornerRadius).withDefault("4px");

// Planning to migrate the radius settings as part of the density system.
/** @public */
export const cornerRadiusLayer = createTokenDimension("density.layer.cornerRadius", StylePropertyShorthand.cornerRadius).withDefault("8px");

/** @public */
export const strokeThickness = createTokenDimension("shape.strokeThickness.default", StylePropertyShorthand.borderThickness).withDefault("1px");

/** @public */
export const focusStrokeThickness = createTokenDimension("shape.strokeThickness.focus", StylePropertyShorthand.borderThickness).withDefault("2px");
