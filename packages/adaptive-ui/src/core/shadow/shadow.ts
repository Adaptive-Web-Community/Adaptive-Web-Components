import { DesignToken, px } from "design-token-library";
import type { Color } from "../color/color.js";

/**
 * Makes a layer of a shadow, the DTCG shadow layer, with its lengths in `px`.
 *
 * @param color - The color of the shadow
 * @param offsetX - The horizontal offset in `px`
 * @param offsetY - The vertical offset in `px`
 * @param blur - The blur radius in `px`
 * @param spread - The spread in `px`, which `text-shadow` and `drop-shadow()` don't have
 * @returns The layer, frozen
 *
 * @public
 */
export function shadow(
    color: Color,
    offsetX: number,
    offsetY: number,
    blur: number = 0,
    spread: number = 0
): DesignToken.DeepReadonly<DesignToken.Values.ShadowLayer> {
    return Object.freeze({ color, offsetX: px(offsetX), offsetY: px(offsetY), blur: px(blur), spread: px(spread) });
}

/**
 * Checks if a value is a shadow, one layer or several.
 *
 * @param value - The value
 * @returns True if it is a shadow
 *
 * @public
 */
export function isShadow(value: unknown): value is DesignToken.Values.Readonly.Shadow {
    const layer = Array.isArray(value) ? value[0] : value;
    return typeof layer === "object" && layer !== null && "offsetX" in layer && "offsetY" in layer;
}
