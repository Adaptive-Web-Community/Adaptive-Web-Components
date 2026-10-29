import { DesignToken, Library } from "design-token-library";
import type { Paint } from "./color/paint.js";
import type { Palette } from "./color/palette.js";
import { Operand } from "./expression.js";
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
    /** A `boolean`, a switch that a recipe reads, which is not written to CSS. */
    boolean: "boolean",
    /** A WCAG contrast ratio, which a recipe reads and which is not written to CSS, see {@link ContrastRatioToken}. */
    contrastRatio: "contrastRatio",
    /** A number that a recipe reads, like the steps of a palette from one color to another, which is not written to CSS, see {@link DeltaToken}. */
    delta: "delta",
    /** A number or dimension that may be calculated from other tokens, see {@link Expression}. */
    expression: "expression",
    /** The `font-style` of text, like `normal` or `italic`. */
    fontStyle: "fontStyle",
    /** The `font-variation-settings` of text. */
    fontVariations: "fontVariations",
    /** A value for each state of an interactive element, which a recipe makes once, see `InteractiveToken`. */
    interactive: "interactive",
    /** A `Paint`, a color or a gradient, written to CSS as the `background` of a fill would be, see {@link PaintToken}. */
    paint: "paint",
    /** A `Palette`, which is not written to CSS. */
    palette: "palette",
    /** A treatment, a named set of style properties, which is rendered as rules and not written to CSS, see `TreatmentToken`. */
    treatment: "treatment",
    /** The WCAG contrast level, which a recipe reads and which is not written to CSS, see {@link WcagContrastLevel}. */
    wcagContrastLevel: "wcagContrastLevel",
} as const;

/**
 * WCAG contrast level (AA or AAA).
 *
 * @public
 */
export const WcagContrastLevel = {
    aa: "aa",
    aaa: "aaa",
} as const;

/** @public */
export type WcagContrastLevel = (typeof WcagContrastLevel)[keyof typeof WcagContrastLevel];

/**
 * A `boolean`.
 *
 * @public
 */
export type BooleanToken = DesignToken.Custom<typeof AdaptiveDesignToken.boolean, boolean>;

/**
 * The WCAG contrast level that the minimum contrasts follow.
 *
 * @public
 */
export type WcagContrastLevelToken = DesignToken.Custom<typeof AdaptiveDesignToken.wcagContrastLevel, WcagContrastLevel>;

/**
 * A WCAG contrast ratio, like `4.5` for 4.5:1, which a recipe reads as the minimum contrast of a color.
 *
 * @remarks
 * It is not written to CSS: the color it changes is calculated in JavaScript, so a custom property of it would change nothing.
 *
 * @public
 */
export type ContrastRatioToken = DesignToken.Custom<typeof AdaptiveDesignToken.contrastRatio, number>;

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

/**
 * A {@link Paint}: a color, or a gradient with its kind and angle, like a fill that is a gradient.
 *
 * @remarks
 * A DTCG `gradient` is only its stops, which the library writes as the stops and not as a `linear-gradient()`, and it has no kind or angle,
 * so a gradient of Adaptive UI is a token of this type. It is written to CSS with `formatPaint`.
 *
 * @public
 */
export type PaintToken = DesignToken.Custom<typeof AdaptiveDesignToken.paint, Paint>;

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
 * A number that a recipe reads, like the number of steps of a palette from one color to another, or the height of a shadow.
 *
 * @remarks
 * It is not written to CSS: the value it changes is calculated in JavaScript, so a custom property of it would change nothing.
 *
 * @public
 */
export type DeltaToken = DesignToken.Custom<typeof AdaptiveDesignToken.delta, number>;

/**
 * The deltas that a recipe of an interactive token reads: a group of delta tokens, one for each of the states that it has a delta for, which is nothing more
 * than that. It has all the states unless it says which, `InteractiveDeltaTokens<InteractiveState.rest | InteractiveState.hover>`, since a recipe doesn't need a delta for every state, or any.
 * A consumer changes one, and the interactive token that reads it is calculated again.
 *
 * @public
 */
export type InteractiveDeltaTokens<S extends InteractiveState = InteractiveState> = { $type: typeof AdaptiveDesignToken.delta } & {
    [key in S]: DeltaToken;
};

/**
 * Gets the refs of the deltas of a group, for the states that it has, to give to a recipe, which gets the numbers.
 *
 * @remarks
 * A group of refs makes a ref for any name, so a group that has some of the states says which.
 *
 * @example
 * ```ts
 * $value: layerRecipes.interactiveFill(layer.palette, color.context, interactiveDeltas(layer.fill.interactiveDeltas)),
 * ```
 *
 * @param group - The refs of the group of the delta tokens, from `refs()`
 * @param states - The states that the group has, if it doesn't have them all
 * @returns The refs of the deltas of the states
 *
 * @public
 */
export function interactiveDeltas<R extends object>(group: Library.Refs<InteractiveDeltaTokens, R>): InteractiveSet<Library.Ref<number, Library.TokenValues<R>>>;
/** @public */
export function interactiveDeltas<S extends InteractiveState, R extends object>(
    group: Library.Refs<InteractiveDeltaTokens<S>, R>,
    states: readonly S[]
): InteractiveSet<Library.Ref<number, Library.TokenValues<R>>>;
export function interactiveDeltas(
    group: { readonly [key in InteractiveState]?: Library.Ref<number, any> },
    states: readonly InteractiveState[] = Object.values(InteractiveState)
): InteractiveSet<Library.Ref<number, any>> {
    const deltas: InteractiveSet<Library.Ref<number, any>> = {};
    for (const state of states) {
        deltas[state] = group[state];
    }
    return deltas;
}
