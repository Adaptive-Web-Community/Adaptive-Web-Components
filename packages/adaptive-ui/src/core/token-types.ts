import { DesignToken } from "design-token-library";
import { Operand } from "./expression.js";

/**
 * The custom token types of Adaptive UI, which are the types that are not defined by DTCG.
 *
 * @remarks
 * The names are here so they are not strings in the token definitions and in the converters of a custom
 * property (see `DesignToken.Custom`). The value type of each is next to it.
 *
 * @public
 */
export const AdaptiveDesignToken = {
    /** A number or dimension that may be calculated from other tokens, see {@link Expression}. */
    expression: "expression",
    /** The `font-style` of text, like `normal` or `italic`. */
    fontStyle: "fontStyle",
    /** The `font-variation-settings` of text. */
    fontVariations: "fontVariations",
} as const;

/**
 * A number or a dimension, which may be an {@link Expression} that is calculated from other tokens.
 *
 * @public
 */
export type ExpressionToken = DesignToken.Custom<typeof AdaptiveDesignToken.expression, Operand>;

/**
 * A `font-style`.
 *
 * @public
 */
export type FontStyleToken = DesignToken.Custom<typeof AdaptiveDesignToken.fontStyle, string>;

/**
 * A `font-variation-settings`.
 *
 * @public
 */
export type FontVariationsToken = DesignToken.Custom<typeof AdaptiveDesignToken.fontVariations, string>;
