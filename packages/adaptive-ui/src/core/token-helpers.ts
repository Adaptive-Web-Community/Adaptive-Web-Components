import { DesignToken } from "@microsoft/fast-foundation";
import { DesignTokenType, TypedCSSDesignToken, TypedDesignToken } from "./adaptive-design-tokens.js";
import { Color } from "./color/color.js";
import { Paint } from "./color/paint.js";
import { Swatch } from "./color/swatch.js";
import { StyleProperty } from "./modules/types.js";
import { Recipe, RecipeEvaluate } from "./recipes.js";

/** @internal @deprecated Use one of the typed `createTokenX` functions instead */
export const { create } = DesignToken;

/** @internal @deprecated Use `createTokenNonCss` instead */
export function createNonCss<T>(name: string): DesignToken<T> {
    return DesignToken.create<T>({ name });
}

/**
 * Creates a typed design token of a custom type. Use one of `createTokenX` if exists instead.
 *
 * @public
 */
export const { createTyped } = TypedCSSDesignToken;

/**
 * Creates a DesignToken that can be used for color value.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @public
 */
export function createTokenColor(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Color> {
    return TypedCSSDesignToken.createTyped<Color>(name, DesignTokenType.color, intendedFor);
}

/**
 * Creates a DesignToken that can be used by other DesignTokens, but not directly in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param type - The allowed types for the token value.
 *
 * @public
 */
export function createTokenNonCss<T>(name: string, type: DesignTokenType, intendedFor?: StyleProperty | StyleProperty[]): TypedDesignToken<T> {
    return TypedDesignToken.createTyped<T>(name, type, intendedFor);
}

/**
 * Creates a DesignToken that can be used for a recipe.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 * @param evaluate - The function to call when the derived token needs to be evaluated.
 *
 * @public
 */
export function createTokenRecipe<TParam, TResult>(
    baseName: string,
    intendedFor: StyleProperty | StyleProperty[],
    evaluate: RecipeEvaluate<TParam, TResult>,
): TypedDesignToken<Recipe<TParam, TResult>> {
    return createTokenNonCss<Recipe<TParam, TResult>>(`${baseName}.recipe`, DesignTokenType.recipe, intendedFor).withDefault({
        evaluate
    });
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
 * Creates a DesignToken that can be used for typography font style (normal, italic) in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export function createTokenFontStyle(name: string): TypedCSSDesignToken<string> {
    return TypedCSSDesignToken.createTyped<string>(name, DesignTokenType.fontStyle, StyleProperty.fontStyle);
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
 * Creates a DesignToken that can be used for number value.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @public
 */
export function createTokenNumber(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<number> {
    return TypedCSSDesignToken.createTyped<number>(name, DesignTokenType.number, intendedFor);
}

/**
 * Creates a DesignToken for number values that can be used by other DesignTokens, but not directly in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @public
 */
export function createTokenNumberNonStyling(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedDesignToken<number> {
    return TypedDesignToken.createTyped<number>(name, DesignTokenType.number, intendedFor);
}

/**
 * Creates a DesignToken that can be used as a paint treatment (background, foreground, border, etc.) in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @remarks
 * This is a token type allowing either `color` or `gradient` values.
 *
 * @public
 */
export function createTokenPaint(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Paint> {
    return TypedCSSDesignToken.createTyped<Paint>(name, DesignTokenType.paint, intendedFor);
}

/**
 * Creates a DesignToken that can be used as a color in styles.
 *
 * @param name - The token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 *
 * @public
 * @deprecated Use createTokenColor or createTokenPaint
 */
export function createTokenSwatch(name: string, intendedFor?: StyleProperty | StyleProperty[]): TypedCSSDesignToken<Swatch> {
    return TypedCSSDesignToken.createTyped<Swatch>(name, DesignTokenType.color, intendedFor);
}
