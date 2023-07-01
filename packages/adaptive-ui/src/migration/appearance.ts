import { create, createTokenNumber } from "../token-helpers.js";

/** @public @deprecated This is changing to a `dimension` type with a value like `4px` */
export const designUnit = createTokenNumber("design-unit").withDefault(4);

/** @public @deprecated Use `cornerRadiusControl` instead */
export const controlCornerRadius = create<number>("control-corner-radius").withDefault(4);

/** @public @deprecated Use `cornerRadiusLayer` instead */
export const layerCornerRadius = create<number>("layer-corner-radius").withDefault(8);

/** @public @deprecated Use `strokeThickness` instead */
export const strokeWidth = create<number>("stroke-width").withDefault(1);

/** @public @deprecated Use `focusStrokeThickness` instead */
export const focusStrokeWidth = create<number>("focus-stroke-width").withDefault(2);
