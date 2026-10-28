/**
 * The names and signatures of what Adaptive UI had for shadows before, for the beta of 1.0 to be an easier step from 0.14.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0, see MIGRATION.md. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import type { DesignToken } from "design-token-library";
import type { Color } from "../color/color.js";
import { shadow } from "./shadow.js";

/**
 * @deprecated Use the library's `DesignToken.Values.ShadowLayer`, which {@link shadow} makes.
 * @public
 */
export type Shadow = DesignToken.DeepReadonly<DesignToken.Values.ShadowLayer>;

/**
 * @deprecated Use {@link shadow}. The layer it makes has `offsetX`, `offsetY`, `blur`, and `spread` as dimensions, and the library's
 * `convert()` writes it.
 * @public
 */
export const Shadow = function (color: Color, xOffset: number, yOffset: number, blurRadius?: number, spread?: number) {
    return shadow(color, xOffset, yOffset, blurRadius, spread);
} as unknown as new (color: Color, xOffset: number, yOffset: number, blurRadius?: number, spread?: number) => Shadow;

/**
 * @deprecated Use the library's `DesignToken.Values.Readonly.Shadow`.
 * @public
 */
export type ShadowValue = DesignToken.Values.Readonly.Shadow;
