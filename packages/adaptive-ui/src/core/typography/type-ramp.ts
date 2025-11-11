import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import type { TypedCSSDesignToken } from "../adaptive-design-tokens.js";
import { TokenGroup } from "../types.js";
import {
    createTokenFontSize,
    createTokenFontVariations,
    createTokenLineHeight
} from "../token-helpers.js";

// TODO: This should be a recipe. Reevaluate as design tokens update.
function fontVariations(sizeToken: DesignToken<string>): (resolve: DesignTokenResolver) => string {
    return (resolve: DesignTokenResolver): string => {
        return "";
    };
}

/**
 * Represents a single position on the type ramp with font size, line height, and font variations.
 *
 * @public
 */
export class TypeRampPosition {
    /**
     * The font size for this type ramp position.
     *
     * @public
     */
    public readonly fontSize: TypedCSSDesignToken<string>;

    /**
     * The line height for this type ramp position.
     *
     * @public
     */
    public readonly lineHeight: TypedCSSDesignToken<string>;

    /**
     * The font variations for this type ramp position.
     *
     * @public
     */
    public readonly fontVariations: TypedCSSDesignToken<string>;

    /**
     * Creates a new type ramp position.
     *
     * @param baseName - The base name of the type ramp.
     * @param position - The position on the type ramp.
     * @param fontSize - The font size for this type ramp position.
     * @param lineHeight - The line height for this type ramp position.
     */
    constructor(
        baseName: string,
        position: string,
        fontSize: string,
        lineHeight: string,
    ) {
        this.fontSize = createTokenFontSize(`${baseName}.fontSize.${position}`).withDefault(fontSize);
        this.lineHeight = createTokenLineHeight(`${baseName}.lineHeight.${position}`).withDefault(lineHeight);
        this.fontVariations = createTokenFontVariations(`${baseName}.fontVariations.${position}`).withDefault(fontVariations(this.fontSize));
    }
}

/**
 * A complete type ramp with all positions from minus2 to plus6.
 *
 * @public
 */
export class TypeRampTokenGroup implements TokenGroup {
    /**
     * The minus2 position on the type ramp.
     *
     * @public
     */
    public readonly minus2: TypeRampPosition;

    /**
     * The minus1 position on the type ramp.
     *
     * @public
     */
    public readonly minus1: TypeRampPosition;

    /**
     * The base position on the type ramp.
     *
     * @public
     */
    public readonly base: TypeRampPosition;

    /**
     * The plus1 position on the type ramp.
     *
     * @public
     */
    public readonly plus1: TypeRampPosition;

    /**
     * The plus2 position on the type ramp.
     *
     * @public
     */
    public readonly plus2: TypeRampPosition;

    /**
     * The plus3 position on the type ramp.
     *
     * @public
     */
    public readonly plus3: TypeRampPosition;

    /**
     * The plus4 position on the type ramp.
     *
     * @public
     */
    public readonly plus4: TypeRampPosition;

    /**
     * The plus5 position on the type ramp.
     *
     * @public
     */
    public readonly plus5: TypeRampPosition;

    /**
     * The plus6 position on the type ramp.
     *
     * @public
     */
    public readonly plus6: TypeRampPosition;

    /**
     * Creates a new type ramp token group with all positions.
     *
     * @param name - The base name of the token group (e.g., "typography.ramp").
     * @param minus2FontSize - The font size for the minus2 position.
     * @param minus2LineHeight - The line height for the minus2 position.
     * @param minus1FontSize - The font size for the minus1 position.
     * @param minus1LineHeight - The line height for the minus1 position.
     * @param baseFontSize - The font size for the base position.
     * @param baseLineHeight - The line height for the base position.
     * @param plus1FontSize - The font size for the plus1 position.
     * @param plus1LineHeight - The line height for the plus1 position.
     * @param plus2FontSize - The font size for the plus2 position.
     * @param plus2LineHeight - The line height for the plus2 position.
     * @param plus3FontSize - The font size for the plus3 position.
     * @param plus3LineHeight - The line height for the plus3 position.
     * @param plus4FontSize - The font size for the plus4 position.
     * @param plus4LineHeight - The line height for the plus4 position.
     * @param plus5FontSize - The font size for the plus5 position.
     * @param plus5LineHeight - The line height for the plus5 position.
     * @param plus6FontSize - The font size for the plus6 position.
     * @param plus6LineHeight - The line height for the plus6 position.
     */
    constructor(
        public readonly name: string,
        minus2FontSize: string,
        minus2LineHeight: string,
        minus1FontSize: string,
        minus1LineHeight: string,
        baseFontSize: string,
        baseLineHeight: string,
        plus1FontSize: string,
        plus1LineHeight: string,
        plus2FontSize: string,
        plus2LineHeight: string,
        plus3FontSize: string,
        plus3LineHeight: string,
        plus4FontSize: string,
        plus4LineHeight: string,
        plus5FontSize: string,
        plus5LineHeight: string,
        plus6FontSize: string,
        plus6LineHeight: string
    ) {
        this.minus2 = new TypeRampPosition(name, "minus2", minus2FontSize, minus2LineHeight);
        this.minus1 = new TypeRampPosition(name, "minus1", minus1FontSize, minus1LineHeight);
        this.base = new TypeRampPosition(name, "base", baseFontSize, baseLineHeight);
        this.plus1 = new TypeRampPosition(name, "plus1", plus1FontSize, plus1LineHeight);
        this.plus2 = new TypeRampPosition(name, "plus2", plus2FontSize, plus2LineHeight);
        this.plus3 = new TypeRampPosition(name, "plus3", plus3FontSize, plus3LineHeight);
        this.plus4 = new TypeRampPosition(name, "plus4", plus4FontSize, plus4LineHeight);
        this.plus5 = new TypeRampPosition(name, "plus5", plus5FontSize, plus5LineHeight);
        this.plus6 = new TypeRampPosition(name, "plus6", plus6FontSize, plus6LineHeight);
    }
}
