import { DesignToken, Library, px } from "design-token-library";
import { divide, multiply, Operand, pow, round } from "../expression.js";
import { StyleProperty } from "../styles/properties.js";
import { intendedFor } from "../token-metadata.js";
import { AdaptiveDesignToken, ExpressionToken, FontVariationsToken } from "../token-types.js";

/**
 * The positions on a type ramp, from the smallest to the largest.
 *
 * @public
 */
export const typeRampPositions = ["minus2", "minus1", "base", "plus1", "plus2", "plus3", "plus4", "plus5", "plus6"] as const;

/**
 * A position on a type ramp.
 *
 * @public
 */
export type TypeRampPosition = (typeof typeRampPositions)[number];

// How many steps of a scale each position is from the base.
const steps: Record<TypeRampPosition, number> = {
    minus2: -2,
    minus1: -1,
    base: 0,
    plus1: 1,
    plus2: 2,
    plus3: 3,
    plus4: 4,
    plus5: 5,
    plus6: 6,
};

// What a ramp has for each position, and the style property each is for when its type doesn't say (see `intendedFor`). This is
// the one place that says what is in a ramp.
const properties = {
    fontSize: { type: AdaptiveDesignToken.expression, for: StyleProperty.fontSize },
    lineHeight: { type: AdaptiveDesignToken.expression, for: StyleProperty.lineHeight },
    lineHeightMultiline: { type: AdaptiveDesignToken.expression, for: StyleProperty.lineHeight },
    fontVariations: { type: AdaptiveDesignToken.fontVariations, for: null },
} as const;

type RampProperty = keyof typeof properties;

// The token of each property of a ramp.
type RampToken = { fontSize: ExpressionToken; lineHeight: ExpressionToken; lineHeightMultiline: ExpressionToken; fontVariations: FontVariationsToken };

/**
 * The tokens of a type ramp: a group for each property with a token for each position.
 *
 * Why a ramp is one type, fixed or from a scale: `docs/decisions/0005-a-type-ramp-is-a-ramp.md`.
 *
 * @remarks
 * The values of a ramp may be fixed, or come from a scale, see {@link typeScale}, or be any expression of other
 * tokens, since these are tokens of the `expression` type.
 *
 * @public
 */
export type TypeRampTokens = {
    [P in RampProperty]: { $type: RampToken[P]["$type"] } & { [Position in TypeRampPosition]: RampToken[P] };
};

/**
 * The tokens of a type ramp that comes from a scale, which has what the positions are calculated from.
 *
 * @public
 */
export type TypeScaleTokens = TypeRampTokens & {
    /**
     * The multiplier between the positions.
     */
    multiplier: DesignToken.Number;

    /**
     * The line height for single-line UI elements as a multiple of the font size.
     */
    lineHeightRatio: DesignToken.Number;

    /**
     * The line height for multiline text as a multiple of the font size.
     */
    lineHeightMultilineRatio: DesignToken.Number;

    /**
     * The line heights are rounded to a multiple of this.
     */
    lineHeightSnap: DesignToken.Dimension;
};

/**
 * Configuration for a single position on the type ramp.
 *
 * @public
 */
export interface TypeRampPositionConfig {
    /**
     * The font size for this position.
     */
    fontSize: Operand;

    /**
     * The line height for single-line UI elements.
     */
    lineHeight: Operand;

    /**
     * The line height for multiline text.
     */
    lineHeightMultiline: Operand;
}

// The tokens of a ramp, with the value of each property of each position.
function ramp(value: (property: RampProperty, position: TypeRampPosition) => unknown) {
    return Object.fromEntries(
        (Object.keys(properties) as RampProperty[]).map(property => [
            property,
            {
                $type: properties[property].type,
                ...Object.fromEntries(
                    typeRampPositions.map(position => {
                        const styleProperty = properties[property].for;
                        return [position, { $value: value(property, position), ...(styleProperty && { $extensions: intendedFor(styleProperty) }) }];
                    })
                ),
            },
        ])
    );
}

/**
 * Creates the tokens of a type ramp with a value for each position, which is the whole ramp from minus2 to plus6.
 *
 * @param config - The font size and line heights of each position
 * @returns The tokens for a group of the library
 *
 * @public
 */
export function typeRamp(config: Record<TypeRampPosition, TypeRampPositionConfig>): Library.Config<TypeRampTokens, any> {
    // TODO: The font variations should be a recipe. Reevaluate as design tokens update.
    return ramp((property, position) =>
        property === "fontVariations" ? "" : config[position][property]
    ) as unknown as Library.Config<TypeRampTokens, any>;
}

/**
 * Creates the tokens of a type ramp that comes from a scale, which generates all positions using a consistent
 * multiplier and line height ratio. The base font size is the primary token to edit, and all the other positions
 * derive from it and the multiplier.
 *
 * @remarks
 * The positions are expressions of the other tokens, like `calc(base * pow(multiplier, 2))`, and
 * `round(fontSize * lineHeightRatio, lineHeightSnap)` for the line heights. The result is a type ramp like any other,
 * with the tokens of the scale next to the positions.
 *
 * @example
 * ```ts
 * // Create a type scale with a 1.2 multiplier
 * typeScale(
 *     refs<Tokens>().typography.ramp.scale,
 *     px(16), // base size
 *     1.2,    // multiplier (each step is 1.2x the previous)
 *     1.3,    // line height ratio for single-line UI (optional, defaults to 1.3)
 *     1.6,    // line height ratio for multiline text (optional, defaults to 1.6)
 *     px(2),  // line height snap for rounding (optional, defaults to 2px)
 * );
 * ```
 *
 * @param scale - The refs of the group of the scale, from `refs()`, as the positions refer to the tokens in it
 * @param baseSize - The font size of the base position
 * @param multiplier - The multiplier between the positions
 * @param lineHeightRatio - The line height for single-line UI elements as a multiple of the font size
 * @param lineHeightMultilineRatio - The line height for multiline text as a multiple of the font size
 * @param lineHeightSnap - The line heights are rounded to a multiple of this, in the unit of the font size
 * @returns The tokens for a group of the library
 *
 * @public
 */
export function typeScale<Root extends object>(
    scale: Library.Refs<TypeScaleTokens, Root>,
    baseSize: DesignToken.Values.Dimension,
    multiplier: number,
    lineHeightRatio: number = 1.3,
    lineHeightMultilineRatio: number = 1.6,
    lineHeightSnap: DesignToken.Values.Dimension = px(2)
): Library.Config<TypeScaleTokens, Root> {
    const fontSize = (position: TypeRampPosition) => {
        const step = steps[position];
        const factor = Math.abs(step) === 1 ? scale.multiplier : pow(scale.multiplier, Math.abs(step));
        return step < 0 ? divide(scale.fontSize.base, factor) : multiply(scale.fontSize.base, factor);
    };

    const lineHeight = (position: TypeRampPosition, ratio: "lineHeightRatio" | "lineHeightMultilineRatio") =>
        round(multiply(scale.fontSize[position], scale[ratio]), scale.lineHeightSnap);

    return {
        ...ramp((property, position) => {
            switch (property) {
                case "fontSize":
                    return position === "base" ? baseSize : fontSize(position);
                case "lineHeight":
                    return lineHeight(position, "lineHeightRatio");
                case "lineHeightMultiline":
                    return lineHeight(position, "lineHeightMultilineRatio");
                case "fontVariations":
                    return "";
            }
        }),
        multiplier: { $type: DesignToken.Type.Number, $value: multiplier },
        lineHeightRatio: { $type: DesignToken.Type.Number, $value: lineHeightRatio },
        lineHeightMultilineRatio: { $type: DesignToken.Type.Number, $value: lineHeightMultilineRatio },
        lineHeightSnap: { $type: DesignToken.Type.Dimension, $value: lineHeightSnap },
    } as unknown as Library.Config<TypeScaleTokens, Root>;
}
