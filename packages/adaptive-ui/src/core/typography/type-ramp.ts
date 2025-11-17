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
 * Configuration for a single position on the type ramp.
 *
 * @public
 */
export interface TypeRampPositionConfig {
    /**
     * The font size for this position.
     */
    fontSize: DesignTokenValue<string>;
    
    /**
     * The line height for single-line UI elements.
     */
    lineHeight: DesignTokenValue<string>;
    
    /**
     * The line height for multiline text.
     */
    lineHeightMultiline: DesignTokenValue<string>;
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
     * The line height for this type ramp position (optimized for single-line UI elements).
     *
     * @public
     */
    public readonly lineHeight: TypedCSSDesignToken<string>;

    /**
     * The line height for multiline text that wraps (optimized for readability).
     *
     * @public
     */
    public readonly lineHeightMultiline: TypedCSSDesignToken<string>;

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
     * @param config - The configuration for this type ramp position.
     */
    constructor(
        baseName: string,
        position: string,
        config: TypeRampPositionConfig,
    ) {
        this.fontSize = createTokenFontSize(`${baseName}.fontSize.${position}`).withDefault(config.fontSize);
        this.lineHeight = createTokenLineHeight(`${baseName}.lineHeight.${position}`).withDefault(config.lineHeight);
        this.lineHeightMultiline = createTokenLineHeight(`${baseName}.lineHeightMultiline.${position}`).withDefault(config.lineHeightMultiline);
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
     * @param minus2 - Configuration for the minus2 position.
     * @param minus1 - Configuration for the minus1 position.
     * @param base - Configuration for the base position.
     * @param plus1 - Configuration for the plus1 position.
     * @param plus2 - Configuration for the plus2 position.
     * @param plus3 - Configuration for the plus3 position.
     * @param plus4 - Configuration for the plus4 position.
     * @param plus5 - Configuration for the plus5 position.
     * @param plus6 - Configuration for the plus6 position.
     */
    constructor(
        public readonly name: string,
        minus2: TypeRampPositionConfig,
        minus1: TypeRampPositionConfig,
        base: TypeRampPositionConfig,
        plus1: TypeRampPositionConfig,
        plus2: TypeRampPositionConfig,
        plus3: TypeRampPositionConfig,
        plus4: TypeRampPositionConfig,
        plus5: TypeRampPositionConfig,
        plus6: TypeRampPositionConfig,
    ) {
        this.minus2 = new TypeRampPosition(name, "minus2", minus2);
        this.minus1 = new TypeRampPosition(name, "minus1", minus1);
        this.base = new TypeRampPosition(name, "base", base);
        this.plus1 = new TypeRampPosition(name, "plus1", plus1);
        this.plus2 = new TypeRampPosition(name, "plus2", plus2);
        this.plus3 = new TypeRampPosition(name, "plus3", plus3);
        this.plus4 = new TypeRampPosition(name, "plus4", plus4);
        this.plus5 = new TypeRampPosition(name, "plus5", plus5);
        this.plus6 = new TypeRampPosition(name, "plus6", plus6);
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
     * The line height ratio token for the type scale (for single-line UI).
     *
     * @public
     */
    public readonly lineHeightRatio: TypedDesignToken<number>;

    /**
     * The line height ratio token for multiline text (for better readability).
     *
     * @public
     */
    public readonly lineHeightMultilineRatio: TypedDesignToken<number>;

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
     * @param lineHeightRatio - The line height ratio for single-line UI (default: 1.4).
     * @param lineHeightSnap - The line height snap value for rounding line heights (default: "2px").
     * @param lineHeightMultilineRatio - The line height ratio for multiline text (default: 1.5).
     */
    constructor(
        name: string,
        baseSize: string,
        multiplier: number,
        lineHeightRatio: number = 1.3,
        lineHeightMultilineRatio: number = 1.6,
        lineHeightSnap: string = "2px",
    ) {
        // Create the tokens
        const multiplierToken = createTokenNumber(`${name}.multiplier`).withDefault(multiplier);
        const lineHeightRatioToken = createTokenNumber(`${name}.lineHeightRatio`).withDefault(lineHeightRatio);
        const lineHeightMultilineRatioToken = createTokenNumber(`${name}.lineHeightMultilineRatio`).withDefault(lineHeightMultilineRatio);
        const lineHeightSnapToken = createTokenDimension(`${name}.lineHeightSnap`).withDefault(lineHeightSnap);
        
        // Create placeholder configs for all positions
        // We'll update the tokens with calculated values after all position tokens are created
        const placeholderConfig: TypeRampPositionConfig = {
            fontSize: "0px",
            lineHeight: "0px",
            lineHeightMultiline: "0px",
        };
        
        // Call parent constructor with placeholder values
        super(
            name,
            placeholderConfig, // minus2
            placeholderConfig, // minus1
            { fontSize: baseSize, lineHeight: "0px", lineHeightMultiline: "0px" }, // base (only fontSize is concrete)
            placeholderConfig, // plus1
            placeholderConfig, // plus2
            placeholderConfig, // plus3
            placeholderConfig, // plus4
            placeholderConfig, // plus5
            placeholderConfig, // plus6
        );
        
        // Set the tokens
        this.multiplier = multiplierToken;
        this.lineHeightRatio = lineHeightRatioToken;
        this.lineHeightMultilineRatio = lineHeightMultilineRatioToken;
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
        this.minus2.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.minus2.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.minus1.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} / ${resolve(multiplierToken)})`
        );
        this.minus1.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.minus1.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.minus1.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.minus1.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.base.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.base.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.base.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.base.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus1.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * ${resolve(multiplierToken)})`
        );
        this.plus1.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus1.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus1.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus1.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus2.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 2))`
        );
        this.plus2.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus2.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus2.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus2.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus3.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 3))`
        );
        this.plus3.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus3.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus3.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus3.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus4.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 4))`
        );
        this.plus4.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus4.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus4.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus4.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus5.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 5))`
        );
        this.plus5.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus5.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus5.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus5.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );

        this.plus6.fontSize.withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(${resolve(this.base.fontSize)} * pow(${resolve(multiplierToken)}, 6))`
        );
        this.plus6.lineHeight.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus6.fontSize)} * ${resolve(lineHeightRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
        this.plus6.lineHeightMultiline.withDefault(
            (resolve: DesignTokenResolver) =>
                `round(${resolve(this.plus6.fontSize)} * ${resolve(lineHeightMultilineRatioToken)}, ${resolve(lineHeightSnapToken)})`
        );
    }
}
