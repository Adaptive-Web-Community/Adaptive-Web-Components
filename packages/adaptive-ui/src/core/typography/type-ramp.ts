import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenValue } from "@microsoft/fast-foundation/design-token-core.js";
import { type TypedCSSDesignToken, type TypedDesignToken } from "../adaptive-design-tokens.js";
import { TokenGroup } from "../types.js";
import {
    createTokenDimension,
    createTokenFontSize,
    createTokenFontVariations,
    createTokenLineHeight,
    createTokenNumber
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
        fontSize: DesignTokenValue<string>,
        lineHeight: DesignTokenValue<string>,
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
        minus2FontSize: DesignTokenValue<string>,
        minus2LineHeight: DesignTokenValue<string>,
        minus1FontSize: DesignTokenValue<string>,
        minus1LineHeight: DesignTokenValue<string>,
        baseFontSize: DesignTokenValue<string>,
        baseLineHeight: DesignTokenValue<string>,
        plus1FontSize: DesignTokenValue<string>,
        plus1LineHeight: DesignTokenValue<string>,
        plus2FontSize: DesignTokenValue<string>,
        plus2LineHeight: DesignTokenValue<string>,
        plus3FontSize: DesignTokenValue<string>,
        plus3LineHeight: DesignTokenValue<string>,
        plus4FontSize: DesignTokenValue<string>,
        plus4LineHeight: DesignTokenValue<string>,
        plus5FontSize: DesignTokenValue<string>,
        plus5LineHeight: DesignTokenValue<string>,
        plus6FontSize: DesignTokenValue<string>,
        plus6LineHeight: DesignTokenValue<string>
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

/**
 * A type ramp generated from a base size and multiplier (type scale).
 * 
 * In this model, the base.fontSize is the primary token that should be edited,
 * and all other positions are derived from it using calc() expressions with the multiplier.
 * 
 * @public
 */
export class TypeScaleTokenGroup extends TypeRampTokenGroup {
    /**
     * The multiplier token for the type scale.
     *
     * @public
     */
    public readonly multiplier: TypedDesignToken<number>;

    /**
     * The line height ratio token for the type scale.
     *
     * @public
     */
    public readonly lineHeightRatio: TypedDesignToken<number>;

    /**
     * The line height snap token for rounding line heights.
     *
     * @public
     */
    public readonly lineHeightSnap: TypedCSSDesignToken<string>;

    /**
     * Creates a new type scale token group.
     *
     * @param name - The base name of the token group (e.g., "typography.ramp.scale").
     * @param baseSize - The base font size as a string value (e.g., "16px").
     * @param multiplier - The multiplier for the type scale (e.g., 1.25).
     * @param lineHeightRatio - The line height ratio (default: 1.4).
     * @param lineHeightSnap - The line height snap value for rounding line heights (default: "2px").
     */
    constructor(
        name: string,
        baseSize: string,
        multiplier: number,
        lineHeightRatio: number = 1.4,
        lineHeightSnap: string = "2px"
    ) {
        // Create the tokens
        const multiplierToken = createTokenNumber(`${name}.multiplier`).withDefault(multiplier);
        const lineHeightRatioToken = createTokenNumber(`${name}.lineHeightRatio`).withDefault(lineHeightRatio);
        const lineHeightSnapToken = createTokenDimension(`${name}.lineHeightSnap`).withDefault(lineHeightSnap);
        
        // Call parent constructor with placeholder values
        // We'll update the tokens with calculated values after all position tokens are created
        super(
            name,
            "0px", // minus2 fontSize placeholder
            "0px", // minus2 lineHeight placeholder
            "0px", // minus1 fontSize placeholder
            "0px", // minus1 lineHeight placeholder
            baseSize, // base fontSize (the only concrete value)
            "0px", // base lineHeight placeholder
            "0px", // plus1 fontSize placeholder
            "0px", // plus1 lineHeight placeholder
            "0px", // plus2 fontSize placeholder
            "0px", // plus2 lineHeight placeholder
            "0px", // plus3 fontSize placeholder
            "0px", // plus3 lineHeight placeholder
            "0px", // plus4 fontSize placeholder
            "0px", // plus4 lineHeight placeholder
            "0px", // plus5 fontSize placeholder
            "0px", // plus5 lineHeight placeholder
            "0px", // plus6 fontSize placeholder
            "0px"  // plus6 lineHeight placeholder
        );
        
        // Set the tokens
        this.multiplier = multiplierToken;
        this.lineHeightRatio = lineHeightRatioToken;
        this.lineHeightSnap = lineHeightSnapToken;

        // Now that all position tokens exist, update them with calculated values
        this.minus2.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} / pow(${resolve(multiplierToken)}, 2))`
        );
        this.minus2.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.minus2.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.minus1.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} / ${resolve(multiplierToken)})`
        );
        this.minus1.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.minus1.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.base.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.base.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus1.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * ${resolve(multiplierToken)})`
        );
        this.plus1.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus1.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus2.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 2))`
        );
        this.plus2.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus2.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus3.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 3))`
        );
        this.plus3.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus3.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus4.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 4))`
        );
        this.plus4.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus4.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus5.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 5))`
        );
        this.plus5.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus5.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus6.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 6))`
        );
        this.plus6.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus6.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
    }
}
