import { type Color, formatColor, type Gradient, isGradient, isPaint, isShadow, toGradient } from "@adaptive-web/adaptive-ui";
import { parse, type Rgb } from "culori/fn";
import { STYLE_REMOVE } from "@adaptive-web/adaptive-ui-designer-core";
import type { DesignToken } from "design-token-library";

/*
 * The values that the UI sends to paint a node are the plain data of the token types of Adaptive UI, as they are in a token: a color has
 * its color space and components, a gradient its stops, a dimension its value and unit, a shadow its layers. These read them for Figma.
 */

/**
 * Gets the red, green, blue, and alpha of a color, which Figma has in `srgb`.
 *
 * @param color - The color
 * @returns The color in `srgb`, with the alpha it has, or opaque
 */
export function colorToRgbOf(color: Color): Rgb {
    if (color.colorSpace === "srgb") {
        const [r, g, b] = color.components.map(component => (component === "none" ? 0 : component));
        return { mode: "rgb", r, g, b, alpha: color.alpha ?? 1 };
    }

    // Another color space is converted by culori, from the CSS that Adaptive UI writes for it.
    const parsed = parse(formatColor(color));
    if (parsed === undefined || parsed.mode !== "rgb") {
        throw new Error(`The color can't be read as sRGB: ${JSON.stringify(color)}`);
    }
    return { ...parsed, alpha: parsed.alpha ?? 1 };
}

/**
 * Tests whether a value is a color.
 */
export function isColor(value: unknown): value is Color {
    return typeof value === "object" && value !== null && "colorSpace" in value && "components" in value;
}

/**
 * Gets a gradient of either kind as a gradient with its type and angle, if the value is a gradient.
 */
export function gradientOf(value: unknown): Gradient | undefined {
    return isPaint(value) && isGradient(value) ? toGradient(value) : undefined;
}

/**
 * Gets a number from a value that a dimension, a number, or a CSS number written as a string may be, as pixels where it has a unit.
 *
 * @remarks
 * A dimension is in `px` or `rem`, and a `rem` is 16 pixels as it is by default. Figma has no other unit for these properties.
 *
 * @param value - The value to read
 * @param defaultValue - What a value that isn't a number, or is the removal of a style, is
 */
export function numberOf(value: unknown, defaultValue: number = 0): number {
    if (value === STYLE_REMOVE) {
        return defaultValue;
    }
    if (typeof value === "number") {
        return value;
    }
    if (typeof value === "object" && value !== null && "value" in value && typeof value.value === "number") {
        return "unit" in value && value.unit === "rem" ? value.value * 16 : value.value;
    }
    if (typeof value === "string") {
        const parsed = Number.parseFloat(value);
        return Number.isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
}

const weights: Record<string, number> = { normal: 400, bold: 700 };

/**
 * Gets the weight of a font from a number, or from `normal` or `bold`.
 */
export function fontWeightOf(value: unknown, defaultValue: number = 400): number {
    return typeof value === "string" && value in weights ? weights[value] : numberOf(value, defaultValue);
}

/**
 * Gets the first family of a font from a list or a CSS list written as a string. The others are for the browser.
 */
export function fontFamilyOf(value: unknown): string | undefined {
    const first = Array.isArray(value) ? value[0] : typeof value === "string" ? value.split(",")[0] : undefined;
    return typeof first === "string" ? first.trim().replace(/['"]/g, "") : undefined;
}

/**
 * Gets the layers of a shadow, which is one layer or a list of them.
 */
export function shadowLayersOf(value: unknown): readonly DesignToken.DeepReadonly<DesignToken.Values.ShadowLayer>[] {
    if (isShadow(value)) {
        return Array.isArray(value) ? value : [value as DesignToken.DeepReadonly<DesignToken.Values.ShadowLayer>];
    }
    return [];
}
