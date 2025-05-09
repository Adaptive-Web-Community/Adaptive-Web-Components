import { clampChroma, modeOkhsl, modeRgb, useMode} from "culori/fn";
import { Gradient, GradientStop, LinearGradient } from "../gradient.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { Color } from "../color.js";

const okhsl = useMode(modeOkhsl);
const rgb = useMode(modeRgb);

/**
 * Color algorithm for a gradient with the source palette in the middle and the hue shifted for the start and end.
 *
 * @param palette - The Palette used for the base of the hue shift
 * @param reference - The reference color
 * @param delta - The offset from the `reference`
 * @param angle - The angle of the gradient
 * @param startShift - The amount and direction of the hue shift at the start
 * @param endShift - The amount and direction of the hue shift at the end
 * @param direction - The direction the delta moves on the palettes, defaults to {@link directionByIsDark} based on `reference`
 * @returns The Gradient
 * 
 * @beta
 */
export function hueShiftGradient(
    palette: Palette,
    reference: Paint,
    delta: number,
    angle?: number,
    startShift: number = -15,
    endShift: number = 15,
    direction: PaletteDirection = directionByIsDark(reference)
): Gradient {
    const centerColor = palette.delta(reference, delta, direction);
    const centerHsl = okhsl(centerColor.color);
    const startAdjust = centerHsl.h! + startShift;
    const startHsl = Object.assign({}, centerHsl, {h: startAdjust < 0 ? 360 + startAdjust : startAdjust});
    const startColor = Color.from(rgb(clampChroma(startHsl, "okhsl")));
    const endAdjust = centerHsl.h! + endShift;
    const endHsl = Object.assign({}, centerHsl, {h: endAdjust > 360 ? endAdjust - 360 : endAdjust});
    const endColor = Color.from(rgb(clampChroma(endHsl, "okhsl")));

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
    return new LinearGradient(stops, angle);
}
