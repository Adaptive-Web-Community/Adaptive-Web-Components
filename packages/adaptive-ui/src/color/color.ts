import { Color as CuloriColor, formatHex, formatRgb, parse, Rgb, wcagLuminance } from "culori";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Represents a color.
 *
 * @public
 */
export class Color implements RelativeLuminance {
    /**
     * The underlying Color value.
     */
    public readonly color: CuloriColor;

    private readonly _relativeLuminance: number;

    /**
     * Creates a new Color.
     *
     * @param color - The underlying Color value
     */
    protected constructor(color: CuloriColor) {
        this.color = Object.freeze(color);
        this._relativeLuminance = wcagLuminance(this.color);
    }

    /**
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    public get relativeLuminance(): number {
        return this._relativeLuminance;
    }

    /**
     * Gets this color value as a string.
     *
     * @returns The color value in string format
     */
    public toColorString(): string {
        return this.color.alpha && this.color.alpha < 1 ? formatRgb(this.color) : formatHex(this.color);
    }

    /**
     * Gets the contrast between this Color and another.
     *
     * @returns The contrast between the two luminance values, for example, 4.54
     */
    public contrast = contrast.bind(null, this);

    /**
     * Gets this color value as a string for use in css.
     *
     * @returns The color value in a valid css string format
     */
    public createCSS = this.toColorString;

    /**
     * Creates a new Color from and object with R, G, and B values expressed as a number between 0 to 1.
     *
     * @param obj - An object with `r`, `g`, and `b` values expressed as a number between 0 and 1.
     * @returns A new Color
     */
    public static from(obj: { r: number; g: number; b: number }): Color {
        const color: Rgb = { mode: "rgb", r: obj.r, g: obj.g, b: obj.b };
        return new Color(color);
    }

    /**
     * Creates a new Color from R, G, and B values expressed as a number between 0 to 1.
     *
     * @param r - Red channel expressed as a number between 0 and 1.
     * @param g - Green channel expressed as a number between 0 and 1.
     * @param b - Blue channel expressed as a number between 0 and 1.
     * @returns A new Color
     */
    public static fromRgb(r: number, g: number, b: number): Color {
        const color: Rgb = { mode: "rgb", r, g, b };
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
}
