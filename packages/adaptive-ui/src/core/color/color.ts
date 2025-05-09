import { cssDirective } from "@microsoft/fast-element";
import { type Color as CuloriColor, formatHex, formatRgb, modeLrgb, modeRgb, parse, type Rgb, useMode, wcagLuminance } from "culori/fn";
import { PaintBase } from "./paint.js";
import { calculateOverlayColor } from "./utilities/opacity.js";

useMode(modeRgb);
// For luminance
useMode(modeLrgb);

/**
 * Represents a color.
 *
 * @public
 */
@cssDirective()
export class Color extends PaintBase {
    /**
     * The underlying Color value.
     */
    public readonly color: CuloriColor;

    /**
     * The opaque value this Color represents if opacity is used.
     */
    protected readonly _intendedColor?: Color;

    /**
     * Creates a new Color.
     *
     * @param color - The underlying color value.
     * @param intendedColor - If `color.alpha` &lt; 1 this tracks the intended opaque color value for dependent calculations.
     */
    constructor(color: CuloriColor, intendedColor?: Color) {
        const lum = intendedColor ? intendedColor.relativeLuminance :
            color.alpha !== undefined && color.alpha < 1 ? Number.NaN : wcagLuminance(color);
        super(lum);
        this.color = Object.freeze(color);
        this._intendedColor = intendedColor;
    }

    /**
     * Gets this color value as a string.
     *
     * @returns The color value in string format
     */
    public toString(): string {
        return this.color.alpha !== undefined && this.color.alpha < 1 ? formatRgb(this.color) : formatHex(this.color);
    }

    /**
     * {@inheritdoc Color.toString}
     *
     * @deprecated Use toString
     */
    public toColorString = this.toString;
    
    /**
     * Gets this color value as a string for use in css.
     *
     * @returns The color value in a valid css string format
     */
    public createCSS = this.toString;

    /**
     * Creates a new Color from an object with R, G, and B values expressed as a number between 0 to 1.
     *
     * @param obj - An object with `r`, `g`, and `b`, and optional `alpha` values expressed as a number between 0 and 1.
     * @returns A new Color
     */
    public static from(obj: { r: number; g: number; b: number, alpha?: number }): Color {
        const color: Rgb = { mode: "rgb", ...obj };
        return new Color(color);
    }

    /**
     * Creates a new Color from R, G, and B values expressed as a number between 0 to 1.
     *
     * @param r - Red channel expressed as a number between 0 and 1.
     * @param g - Green channel expressed as a number between 0 and 1.
     * @param b - Blue channel expressed as a number between 0 and 1.
     * @param alpha - Alpha channel expressed as a number between 0 and 1.
     * @returns A new Color
     */
    public static fromRgb(r: number, g: number, b: number, alpha?: number): Color {
        const color: Rgb = { mode: "rgb", r, g, b, alpha };
        return new Color(color);
    }

    /**
     * Creates a new Color from a parsable string.
     *
     * @param color - A string representation of the Color.
     * @returns The Color object or undefined.
     */
    public static parse(color: string): Color | undefined {
        const parsedColor = parse(color);
        if (parsedColor) {
            return new Color(parsedColor);
        }
    }

    /**
     * Creates a new Color as an overlay representation of the `intendedColor` over `reference`.
     *
     * Currently the overlay will only be black or white, so this works best with a plain grey neutral palette.
     * Otherwise it will attempt to match the luminance value of the Color, so it will likely be close, but not an
     * exact match to the color from another palette.
     *
     * @param intendedColor - The Color the overlay should look like over the `reference` Color.
     * @param reference - The Color under the overlay color.
     * @returns A semitransparent Color that represents the `intendedColor` over the `reference` Color.
     */
    public static asOverlay(intendedColor: Color, reference: Color): Color {
        const refColor = reference instanceof Color && reference._intendedColor ? reference._intendedColor.color : reference.color;
        const colorWithAlpha = calculateOverlayColor(intendedColor.color, refColor);

        return new Color(colorWithAlpha, intendedColor);
    }

    /**
     * Creates a new Color from another Color and the target opacity.
     *
     * @remarks It's "unsafe" because it can't be used for contrast calculations.
     *
     * @param color - A Color object without opacity.
     * @param alpha - The opacity expressed as a number between 0 and 1.
     * @returns A new Color
     */
    public static unsafeOpacity(color: Color, alpha: number): Color {
        const transparentColor = { ...color.color };
        transparentColor.alpha = alpha;
        return new Color(transparentColor);
    }
}
