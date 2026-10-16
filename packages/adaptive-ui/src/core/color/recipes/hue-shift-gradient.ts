import { clampChroma, modeOkhsl, modeRgb, useMode } from "culori/fn";
import { fromCulori, toCulori } from "../color.js";
import { Gradient, GradientStop, linearGradient } from "../gradient.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { deltaColor } from "./delta-color.js";

const okhsl = useMode(modeOkhsl);
useMode(modeRgb);

/**
 * Options for {@link hueShiftGradient}.
 *
 * @beta
 */
export interface HueShiftGradientOptions {
    /**
     * The angle of the gradient.
     */
    angle?: number;

    /**
     * The amount and direction of the hue shift at the start, defaults to -15.
     */
    startShift?: number;

    /**
     * The amount and direction of the hue shift at the end, defaults to 15.
     */
    endShift?: number;

    /**
     * The direction the delta moves on the palette, defaults to {@link directionByIsDark} based on `reference`.
     */
    direction?: PaletteDirection;
}

/**
 * Color algorithm for a gradient with the source palette in the middle and the hue shifted for the start and end.
 *
 * @param palette - The Palette used for the base of the hue shift
 * @param reference - The reference color
 * @param delta - The offset from the `reference`
 * @param options - The angle, the hue shift at the start and end, and the direction
 * @returns The Gradient
 *
 * @beta
 */
export function hueShiftGradient(
    palette: Palette,
    reference: Paint,
    delta: number,
    options: HueShiftGradientOptions = {}
): Gradient {
    const { angle, startShift = -15, endShift = 15, direction = directionByIsDark(reference) } = options;

    const centerColor = deltaColor(palette, reference, delta, direction);
    const centerHsl = okhsl(toCulori(centerColor));
    const startAdjust = centerHsl.h! + startShift;
    const startHsl = Object.assign({}, centerHsl, { h: startAdjust < 0 ? 360 + startAdjust : startAdjust });
    const startColor = fromCulori(clampChroma(startHsl, "okhsl"));
    const endAdjust = centerHsl.h! + endShift;
    const endHsl = Object.assign({}, centerHsl, { h: endAdjust > 360 ? endAdjust - 360 : endAdjust });
    const endColor = fromCulori(clampChroma(endHsl, "okhsl"));

    const stops: GradientStop[] = [
        {
            color: startColor,
            position: { value: 0, unit: "%" },
        },
        {
            color: centerColor,
            position: { value: 0.5, unit: "%" },
        },
        {
            color: endColor,
            position: { value: 1, unit: "%" },
        },
    ];
    return linearGradient(stops, angle);
}
