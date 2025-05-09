import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { createTokenNumber, createTokenPaint } from "../core/token-helpers.js";
import { hueShiftGradient } from "../core/color/recipes/hue-shift-gradient.js";
import { twoPaletteGradient } from "../core/color/recipes/two-palette-gradient.js";
import { Fill, Styles } from "../core/modules/styles.js";
import { StyleProperty } from "../core/modules/types.js";
import { accentStrokeSafety, fillColor, fillSubtleRestDelta, neutralFillSubtle } from "./color.js";
import { accentPalette, highlightPalette } from "./palette.js";
import { densityBorderStyles } from "./util.js";

/**
 * @beta
 */
export const gradientAngle = createTokenNumber("color.gradient.angle").withDefault(180);
// css is strange, if you provide the rotation, 180deg is the same as if it was not provided (not 0).

/**
 * @beta
 */
export const gradientStartShift = createTokenNumber("color.gradient.startShift").withDefault(15);

/**
 * @beta
 */
export const gradientEndShift = createTokenNumber("color.gradient.endShift").withDefault(15);

/**
 * @beta
 */
export const accentHueShiftGradientFillSubtleRest = createTokenPaint("color.accentHueShiftGradient.fill.subtle.rest", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const palette = resolve(accentPalette);
        const reference = resolve(fillColor);
        const delta = resolve(fillSubtleRestDelta);
        const angle = resolve(gradientAngle);
        const startShift = resolve(gradientStartShift);
        const endShift = resolve(gradientEndShift);
        return hueShiftGradient(palette, reference, delta, angle, startShift, endShift);
    }
);

/**
 * @beta
 */
export const accentToHighlightGradientFillSubtleRest = createTokenPaint("color.accentToHighlightGradient.fill.subtle.rest", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) => {
        const startPalette = resolve(accentPalette);
        const endPalette = resolve(highlightPalette);
        const reference = resolve(fillColor);
        const delta = resolve(fillSubtleRestDelta);
        const angle = resolve(gradientAngle);
        console.log("twoPaletteGradient", delta, angle);
        return twoPaletteGradient(startPalette, endPalette, reference, delta, angle);
    }
);

/**
 * @beta
 */
export const accentHueShiftGradientFillSubtleElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundNonInteractive(accentHueShiftGradientFillSubtleRest, neutralFillSubtle.rest),
        ...densityBorderStyles(accentStrokeSafety),
    },
    "color.accent-hue-shift-gradient-fill-subtle-element",
);

/**
 * @beta
 */
export const accentToHighlightGradientFillSubtleElementStyles: Styles = Styles.fromProperties(
    {
        ...Fill.backgroundNonInteractive(accentToHighlightGradientFillSubtleRest, neutralFillSubtle.rest),
        ...densityBorderStyles(accentStrokeSafety),
    },
    "color.accent-to-highlight-gradient-fill-subtle-element",
);
