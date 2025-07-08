import { Gradient, GradientStop, LinearGradient } from "../gradient.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Color algorithm for a gradient between two colors.
 *
 * @param startPalette - The Palette used for the start of the gradient
 * @param endPalette - The Palette used for the end of the gradient
 * @param reference - The reference color
 * @param delta - The offset from the `reference`
 * @param angle - The angle of the gradient
 * @param direction - The direction the delta moves on the palettes, defaults to {@link directionByIsDark} based on `reference`
 * @returns The Gradient
 * 
 * @beta
 */
export function twoPaletteGradient(
    startPalette: Palette,
    endPalette: Palette,
    reference: Paint,
    delta: number,
    angle?: number,
    direction: PaletteDirection = directionByIsDark(reference)
): Gradient {
    const startColor = startPalette.delta(reference, delta, direction);
    const endColor = endPalette.delta(reference, delta, direction);

    const stops: GradientStop[] = [
        {
            color: startColor,
            position: { value: 0, unit: "%" },
        },
        {
            color: endColor,
            position: { value: 1, unit: "%" },
        },
    ];
    return new LinearGradient(stops, angle);
}
