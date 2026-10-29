import { Gradient, GradientStop, linearGradient } from "../gradient.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection } from "../palette.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { deltaColor } from "./delta-color.js";

/**
 * Options for {@link twoPaletteGradient}.
 *
 * @beta
 */
export interface TwoPaletteGradientOptions {
    /**
     * The angle of the gradient.
     */
    angle?: number;

    /**
     * The direction the delta moves on the palettes, defaults to {@link directionByIsDark} based on `reference`.
     */
    direction?: PaletteDirection;
}

/**
 * Color algorithm for a gradient between two palettes.
 *
 * @param startPalette - The Palette used for the start of the gradient
 * @param endPalette - The Palette used for the end of the gradient
 * @param reference - The reference color
 * @param delta - The offset from the `reference`
 * @param options - The angle and the direction
 * @returns The Gradient
 *
 * @beta
 */
export function twoPaletteGradient(
    startPalette: Palette,
    endPalette: Palette,
    reference: Paint,
    delta: number,
    options: TwoPaletteGradientOptions = {}
): Gradient {
    const { angle, direction = directionByIsDark(reference) } = options;

    const startColor = deltaColor(startPalette, reference, delta, direction);
    const endColor = deltaColor(endPalette, reference, delta, direction);

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
    return linearGradient(stops, angle);
}
