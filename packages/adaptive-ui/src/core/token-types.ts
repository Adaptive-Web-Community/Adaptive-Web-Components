import { DesignToken } from "design-token-library";
import type { Palette } from "./color/palette.js";
import { OperandValue } from "./expression.js";
import { InteractiveSet, InteractiveState } from "./interactive.js";

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
    /** A value for each state of an interactive element, which a recipe makes once, see `InteractiveToken`. */
    interactive: "interactive",
    /** A `Palette`, which is not written to CSS. */
    palette: "palette",
} as const;

/**
 * A number or a dimension, which may be an {@link Expression} that is calculated from other tokens.
 *
 * @public
 */
export type ExpressionToken = DesignToken.Custom<typeof AdaptiveDesignToken.expression, OperandValue>;

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

/**
 * A {@link Palette}.
 *
 * @public
 */
export type PaletteToken = DesignToken.Custom<typeof AdaptiveDesignToken.palette, Palette>;

/**
 * The values of the states of an interactive element (`rest`, `hover`, `active`, `focus`, `disabled`), like the fills that a recipe makes, which
 * are calculated once and travel as a set. A state has a value only if the recipe gives it one. It is for any value: colors, dimensions.
 *
 * Why it is one token: `docs/decisions/0006-interactive-values-are-one-token.md`.
 *
 * @public
 */
export type InteractiveToken<V> = DesignToken.Custom<typeof AdaptiveDesignToken.interactive, InteractiveSet<V>>;

/**
 * The deltas that a recipe of an interactive token reads: a group of number tokens, one for each of the states that it has a delta for, which is nothing more
 * than that. It has all the states unless it says which, `InteractiveDeltaTokens<InteractiveState.rest | InteractiveState.hover>`, since a recipe doesn't need a delta for every state, or any.
 * A consumer changes one, and the interactive token that reads it is calculated again.
 *
 * @public
 */
export type InteractiveDeltaTokens<S extends InteractiveState = InteractiveState> = { $type: DesignToken.Type.Number } & {
    [key in S]: DesignToken.Number;
};

/**
 * Gets the numbers of the deltas of a group, for the states that it has, which is what a recipe is given.
 *
 * @param group - The group of the delta tokens
 * @returns The deltas of the states that the group has
 *
 * @public
 */
export function interactiveDeltas(group: { readonly [key in InteractiveState]?: { readonly $value: number } }): InteractiveSet<number> {
    const deltas: InteractiveSet<number> = {};
    for (const state of Object.values(InteractiveState)) {
        const token = group[state];
        if (token !== undefined) {
            deltas[state] = token.$value;
        }
    }
    return deltas;
}
