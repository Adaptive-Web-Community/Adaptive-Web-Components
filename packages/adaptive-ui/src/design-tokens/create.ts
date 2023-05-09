import { DesignToken } from "@microsoft/fast-foundation";
import { DesignTokenType, TypedCSSDesignToken } from "../adaptive-design-tokens.js";
import { Swatch } from "../color/swatch.js";
import { StyleProperty } from "../modules/types.js";

/** @internal @deprecated Use one of the typed `createTokenX` functions instead */
export const { create } = DesignToken;

/** @internal @deprecated Use `createTokenNonCss` instead */
export function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name });
}

/**
 * Creates a DesignToken that can be used by other DesignTokens, but not directly in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name });
}

/**
 * Creates a DesignToken that can be used for thickness, sizes, and other dimension values in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @public
 */
export function createTokenDimension(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<string> {
    return TypedCSSDesignToken.createTyped<string>(name, DesignTokenType.dimension, intendedFor);
}

/**
 * Creates a DesignToken that can be used for typography font family in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenFontFamily(name: string): TypedCSSDesignToken<string> {
    return TypedCSSDesignToken.createTyped<string>(name, DesignTokenType.fontFamily, StyleProperty.fontFamily);
}

/**
 * Creates a DesignToken that can be used for typography font size in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenFontSize(name: string): TypedCSSDesignToken<string> {
    return createTokenDimension(name, StyleProperty.fontSize);
}

/**
 * Creates a DesignToken that can be used for typography font variations in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenFontVariations(name: string): TypedCSSDesignToken<string> {
    return TypedCSSDesignToken.createTyped<string>(name, DesignTokenType.fontVariations, StyleProperty.fontVariationSettings);
}

/**
 * Creates a DesignToken that can be used for typography font weight in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenFontWeight(name: string): TypedCSSDesignToken<number> {
    return TypedCSSDesignToken.createTyped<number>(name, DesignTokenType.fontWeight, StyleProperty.fontWeight);
}

/**
 * Creates a DesignToken that can be used for typography line height in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenLineHeight(name: string): TypedCSSDesignToken<string> {
    return createTokenDimension(name, StyleProperty.lineHeight);
}

/**
 * Creates a DesignToken that can be used as a fill in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @remarks
 * This is a token type allowing either `color` or `gradient` values.
 *
 * @public
 */
export function createTokenSwatch(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Swatch> {
    return TypedCSSDesignToken.createTyped<Swatch>(
        name,
        [DesignTokenType.color, DesignTokenType.gradient],
        intendedFor
    );
}
