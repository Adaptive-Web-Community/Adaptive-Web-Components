import { modeRgb, parse, type Rgb, useMode } from "culori/fn";
import { Color } from "./color.js";
import { calculateOverlayColor } from "./utilities/opacity.js";

const rgb = useMode(modeRgb);

/**
 * Legacy equivalent of Color.
 *
 * @public
 * @deprecated Use {@link Color}.
 */
export class Swatch extends Color {
    /**
     * Gets this color with transparency.
     *
     * @returns The color with full transparency
     * @deprecated Use Color.unsafeOpacity
     */
    public toTransparent(alpha: number = 0): Swatch {
        const transparentColor = { ...this.color };
        transparentColor.alpha = alpha;
        return new Swatch(transparentColor, this);
    }

    /**
     * Creates a new Swatch from and object with R, G, and B values expressed as a number between 0 to 1.
     *
     * @param obj - An object with `r`, `g`, and `b`, and optional `alpha` values expressed as a number between 0 and 1.
     * @returns A new Swatch
     */
    public static from(obj: { r: number; g: number; b: number, alpha?: number }): Swatch {
        const color: Rgb = { mode: "rgb", ...obj };
        return new Swatch(color);
    }

    /**
     * Creates a new Swatch from R, G, and B values expressed as a number between 0 to 1.
     *
     * @param r - Red channel expressed as a number between 0 and 1.
     * @param g - Green channel expressed as a number between 0 and 1.
     * @param b - Blue channel expressed as a number between 0 and 1.
     * @param alpha - Alpha channel expressed as a number between 0 and 1.
     * @returns A new Swatch
     */
    public static fromRgb(r: number, g: number, b: number, alpha?: number): Swatch {
        const color: Rgb = { mode: "rgb", r, g, b, alpha };
        return new Swatch(color);
    }

    /**
     * Creates a new Swatch from a Color.
     *
     * @param color - A Color
     * @returns A new Swatch
     */
    public static fromColor(color: Color): Swatch {
        return new Swatch(color.color);
    }

    /**
     * Creates a new Swatch from a parsable string.
     *
     * @param color - A string representation of the Swatch.
     * @returns The Swatch object or undefined.
     */
    public static parse(color: string): Swatch | undefined {
        const parsedColor = parse(color);
        if (parsedColor) {
            return new Swatch(parsedColor);
        }
    }

    /**
     * Creates a new Swatch as an overlay representation of the `intendedColor` over `reference`.
     *
     * Currently the overlay will only be black or white, so this works best with a plain grey neutral palette.
     * Otherwise it will attempt to match the luminance value of the Swatch, so it will likely be close, but not an
     * exact match to the color from another palette.
     *
     * @param intendedColor - The Swatch the overlay should look like over the `reference` Swatch.
     * @param reference - The Swatch under the overlay color.
     * @returns A semitransparent Swatch that represents the `intendedColor` over the `reference` Swatch.
     */
    public static asOverlay(intendedColor: Swatch, reference: Swatch): Swatch {
        const refColor = reference._intendedColor ? reference._intendedColor.color : reference.color;
        const colorWithAlpha = calculateOverlayColor(rgb(intendedColor.color), rgb(refColor));

        return new Swatch(colorWithAlpha, intendedColor);
    }
}
