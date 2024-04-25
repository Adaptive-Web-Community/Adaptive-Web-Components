import { type Color as CuloriColor, modeRgb, parse, type Rgb, useMode } from "culori/fn";
import { Color } from "./color.js";

const rgb = useMode(modeRgb);

const rgbBlack: Rgb = { mode: "rgb", r: 0, g: 0, b: 0 };
const rgbWhite: Rgb = { mode: "rgb", r: 1, g: 1, b: 1 };

function calcChannelOverlay(match: number, background: number, overlay: number): number {
    if (overlay - background === 0) {
        return 0;
    } else {
        return (match - background) / (overlay - background);
    }
}

function calcRgbOverlay(rgbMatch: Rgb, rgbBackground: Rgb, rgbOverlay: Rgb): number {
    const rChannel: number = calcChannelOverlay(rgbMatch.r, rgbBackground.r, rgbOverlay.r);
    const gChannel: number = calcChannelOverlay(rgbMatch.g, rgbBackground.g, rgbOverlay.g);
    const bChannel: number = calcChannelOverlay(rgbMatch.b, rgbBackground.b, rgbOverlay.b);
    return (rChannel + gChannel + bChannel) / 3;
}

/**
 * Calculate an overlay color that uses rgba (rgb + alpha) that matches the appearance of a given solid color
 * when placed on the same background.
 *
 * @param rgbMatch - The solid color the overlay should match in appearance when placed over the rgbBackground
 * @param rgbBackground - The background on which the overlay rests
 * @returns The rgba (rgb + alpha) color of the overlay
 */
function calculateOverlayColor(rgbMatch: Rgb, rgbBackground: Rgb): Rgb {
    let overlay = rgbBlack;
    let alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    if (alpha <= 0) {
        overlay = rgbWhite;
        alpha = calcRgbOverlay(rgbMatch, rgbBackground, overlay);
    }
    alpha = Math.round(alpha * 1000) / 1000;

    return Object.assign({}, overlay, { alpha });
}

/**
 * Extends {@link Color} adding support for relative opacity.
 *
 * @public
 */
export class Swatch extends Color {
    /**
     * The opaque value this Swatch represents if opacity is used.
     */
    private readonly _intendedColor?: Swatch;

    /**
     * Creates a new Swatch.
     *
     * @param color - The underlying Color value
     * @param intendedColor - If `color.alpha` &lt; 1 this tracks the intended opaque color value for dependent calculations
     */
    protected constructor(color: CuloriColor, intendedColor?: Swatch) {
        super(color);
        this._intendedColor = intendedColor;
    }

    /**
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    public get relativeLuminance(): number {
        return this._intendedColor
            ? this._intendedColor.relativeLuminance
            : super.relativeLuminance;
    }

    /**
     * Gets this color with transparency.
     *
     * @returns The color with full transparency
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
