import type { DesignToken } from "design-token-library";
import {
    type Color as CuloriColor,
    formatHex,
    formatRgb,
    modeA98,
    modeHsl,
    modeHwb,
    modeLab,
    modeLch,
    modeLrgb,
    modeOklab,
    modeOklch,
    modeP3,
    modeProphoto,
    modeRec2020,
    modeRgb,
    modeXyz50,
    modeXyz65,
    parse,
    useMode,
    wcagLuminance,
} from "culori/fn";

const rgb = useMode(modeRgb);
// For luminance
useMode(modeLrgb);
// For the other color spaces of a `Color`
[modeA98, modeHsl, modeHwb, modeLab, modeLch, modeOklab, modeOklch, modeP3, modeProphoto, modeRec2020, modeXyz50, modeXyz65].forEach(
    mode => useMode(mode)
);

/**
 * A color, as plain data.
 *
 * @remarks
 * This is a {@link https://www.designtokens.org/tr/2025.10/color/ | DTCG color}, the readonly type of the design token
 * library, so a color is a token value as is. For `srgb` the components are red, green, and blue from 0 to 1. For the other
 * color spaces the range of the components is defined by the DTCG Color module.
 *
 * The functions of this module and the recipes work on any color space, but colors they create are `srgb`.
 *
 * @public
 */
export type Color = DesignToken.Values.Readonly.Color;

/**
 * A semitransparent {@link Color} that stands in for an opaque one.
 *
 * @remarks
 * See {@link asOverlay}. Contrast and palette calculations use the opaque `intendedColor`, since the color of the
 * overlay itself depends on what is under it.
 *
 * @public
 */
export interface OverlayColor extends Color {
    /**
     * The opaque color this overlay is meant to look like.
     */
    intendedColor: Color;
}

/**
 * Creates a color from red, green, and blue values expressed as a number between 0 to 1.
 *
 * @param r - Red channel expressed as a number between 0 and 1.
 * @param g - Green channel expressed as a number between 0 and 1.
 * @param b - Blue channel expressed as a number between 0 and 1.
 * @param alpha - Alpha channel expressed as a number between 0 and 1.
 * @returns A new color
 *
 * @public
 */
export function rgbColor(r: number, g: number, b: number, alpha?: number): Color {
    const components: Color["components"] = [r, g, b];
    return Object.freeze({ colorSpace: "srgb", components: Object.freeze(components), ...(alpha === undefined ? {} : { alpha }) });
}

/**
 * Creates a color from a parsable string.
 *
 * @param color - A string representation of the color, like `#336699` or `rgb(51 102 153)`.
 * @returns The color, or undefined if the string can't be parsed.
 *
 * @public
 */
export function parseColor(color: string): Color | undefined {
    const parsed = parse(color);
    if (parsed) {
        const { r, g, b, alpha } = rgb(parsed);
        return rgbColor(r, g, b, alpha);
    }
}

/**
 * Checks if a color is transparent.
 *
 * @param color - The color to check.
 * @returns True if the color is fully transparent, false otherwise.
 *
 * @public
 */
export function isTransparent(color: Color): boolean {
    return color.alpha === 0;
}

/**
 * Converts a color to the representation used for calculations.
 *
 * @param color - The color
 * @returns The same color as a culori color, in any color space culori supports
 *
 * @internal
 */
export function toCulori(color: Color): CuloriColor {
    // A missing component is 0 for the conversions.
    const [c1, c2, c3] = color.components.map(c => (c === "none" ? 0 : c));
    const converted = toCuloriComponents(color.colorSpace, c1, c2, c3);
    if (color.alpha !== undefined) {
        converted.alpha = color.alpha;
    }
    return converted;
}

// The components of each color space in the shape culori expects. DTCG uses percent for the saturation, lightness,
// whiteness, and blackness components of the polar and cylindrical spaces where culori uses a fraction.
function toCuloriComponents(space: Color["colorSpace"], c1: number, c2: number, c3: number): CuloriColor {
    switch (space) {
        case "srgb":
            return { mode: "rgb", r: c1, g: c2, b: c3 };
        case "srgb-linear":
            return { mode: "lrgb", r: c1, g: c2, b: c3 };
        case "hsl":
            return { mode: "hsl", h: c1, s: c2 / 100, l: c3 / 100 };
        case "hwb":
            return { mode: "hwb", h: c1, w: c2 / 100, b: c3 / 100 };
        case "lab":
            return { mode: "lab", l: c1, a: c2, b: c3 };
        case "lch":
            return { mode: "lch", l: c1, c: c2, h: c3 };
        case "oklab":
            return { mode: "oklab", l: c1, a: c2, b: c3 };
        case "oklch":
            return { mode: "oklch", l: c1, c: c2, h: c3 };
        case "display-p3":
            return { mode: "p3", r: c1, g: c2, b: c3 };
        case "a98-rgb":
            return { mode: "a98", r: c1, g: c2, b: c3 };
        case "prophoto-rgb":
            return { mode: "prophoto", r: c1, g: c2, b: c3 };
        case "rec2020":
            return { mode: "rec2020", r: c1, g: c2, b: c3 };
        case "xyz-d65":
            return { mode: "xyz65", x: c1, y: c2, z: c3 };
        case "xyz-d50":
            return { mode: "xyz50", x: c1, y: c2, z: c3 };
    }
}

/**
 * Converts a culori color to a {@link Color} in `srgb`.
 *
 * @param color - The culori color
 * @returns The same color as an `srgb` color
 *
 * @internal
 */
export function fromCulori(color: CuloriColor): Color {
    const { r, g, b, alpha } = rgb(color);
    return rgbColor(r, g, b, alpha);
}

/**
 * Gets a color as a string for use in CSS.
 *
 * @param color - The color
 * @returns A hex color, or `rgb()` if the color has opacity, or `transparent`
 *
 * @public
 */
export function formatColor(color: Color): string {
    if (isTransparent(color)) {
        return "transparent";
    }
    const culori = toCulori(color);
    return color.alpha !== undefined && color.alpha < 1 ? formatRgb(culori) : formatHex(culori);
}

const luminances = new WeakMap<Color, number>();

/**
 * Gets the relative luminance of a color.
 *
 * @remarks
 * A semitransparent color has an unknown luminance, since it depends on what is under it, so it is `NaN` unless it
 * is an {@link OverlayColor}, which uses the luminance of the color it stands in for.
 *
 * @param color - The color
 * @returns The relative luminance, from 0 (black) to 1 (white)
 *
 * @public
 */
export function colorLuminance(color: Color): number {
    let luminance = luminances.get(color);
    if (luminance === undefined) {
        luminance =
            "intendedColor" in color
                ? colorLuminance((color as OverlayColor).intendedColor)
                : color.alpha !== undefined && color.alpha < 1
                  ? Number.NaN
                  : wcagLuminance(toCulori(color));
        luminances.set(color, luminance);
    }
    return luminance;
}

/**
 * Creates a color from another color and an opacity.
 *
 * @remarks
 * The relative luminance of the result is unknown, so it can't be used for contrast calculations. See {@link asOverlay}.
 *
 * @param color - A color without opacity.
 * @param alpha - The opacity expressed as a number between 0 and 1.
 * @returns A new color
 *
 * @public
 */
export function withAlpha(color: Color, alpha: number): Color {
    const result: Partial<OverlayColor> = { ...color, alpha };
    delete result.intendedColor;
    return Object.freeze(result as Color);
}
