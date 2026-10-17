import { DesignToken, Library } from "design-token-library";
import { add, multiply, ref, subtract } from "../expression.js";
import { StyleProperty, StylePropertyShorthand } from "../modules/types.js";
import { intendedFor } from "../token-metadata.js";
import { AdaptiveDesignToken, ExpressionToken } from "../token-types.js";

/**
 * The padding and the gap of one direction, from the units that they are a multiple of.
 *
 * @public
 */
export interface DensityAxisTokens {
    /**
     * The design unit multiplier of the padding, ex: `3` to set the padding to 3 units. Positive, may be fractional.
     */
    paddingUnits: DesignToken.Number;

    /**
     * The padding, calculated from `paddingUnits`, the adjustment, the design unit, and the border thickness.
     */
    padding: ExpressionToken;

    /**
     * The design unit multiplier of the gap between elements, ex: `2` to set the gap to 2 units. May be fractional.
     */
    gapUnits: DesignToken.Number;

    /**
     * The gap between elements within a component, which is useful as the `gap` of a `flex` layout or as a margin.
     */
    gap: ExpressionToken;
}

/**
 * The tokens of a density set, one level of density: the padding and the gap of each direction, measured in the design unit.
 *
 * @public
 */
export interface DensitySetTokens {
    /**
     * The dimension of a design unit for the density calculation.
     */
    designUnit: DesignToken.Dimension;

    /**
     * The dimension of the border, which the padding is adjusted for.
     */
    borderThickness: DesignToken.Dimension;

    horizontal: DensityAxisTokens;
    vertical: DensityAxisTokens;
}

/**
 * The units of the padding and the gap of a density set.
 *
 * @public
 */
export interface DensityUnits {
    horizontalPadding: number;
    horizontalGap: number;
    verticalPadding: number;
    verticalGap: number;
}

/**
 * What the tokens of a density set read: the adjustment that is added to the units of every set, and the set itself, which is at the
 * `density` group of the library under its name.
 *
 * @public
 */
export interface DensityRootTokens<N extends string> {
    density: {
        /**
         * The adjustment (plus or minus) to the density units. It is not a multiplier, so `0` has no effect and `1` adds a unit.
         * Ex: `-1` to reduce all the density values. May be fractional.
         */
        adjustmentUnits: DesignToken.Number;
    } & { [K in N]: DensitySetTokens };
}

type Dimension = DesignToken.Values.Dimension;

/**
 * Creates a density set: the tokens of the padding and the gap, `(units + adjustment) * designUnit`, less the border thickness for the padding.
 *
 * @remarks
 * It gives the config of the set at its name, to spread into the `density` group of a library, so a system adds its own sets the way the
 * default ones are:
 *
 * ```ts
 * density: {
 *     adjustmentUnits: { $type: DesignToken.Type.Number, $value: 0 },
 *     ...createDensity("text", { horizontalPadding: 0, horizontalGap: 1, verticalPadding: 0, verticalGap: 1 }, px(4), px(0)),
 * },
 * ```
 *
 * The calculations are expressions of the tokens, so they are `calc()` of the custom properties in CSS, and a change to the adjustment, the
 * design unit, the border thickness or any of the units changes them in the browser.
 *
 * @param name - The name of the set in the `density` group
 * @param units - The units of the padding and the gap
 * @param designUnit - The design unit, a dimension or an alias of another token
 * @param borderThickness - The border thickness, a dimension or an alias of another token
 * @returns The config of the set at `name`
 *
 * @public
 */
export function createDensity<N extends string, Root extends DensityRootTokens<N>>(
    name: N,
    units: DensityUnits,
    designUnit: Dimension | Library.ValueAlias<Dimension, Library.Context<Root>>,
    borderThickness: Dimension | Library.ValueAlias<Dimension, Library.Context<Root>>
): Library.Config<{ [K in N]: DensitySetTokens }, Root> {
    // The set is where this config puts it, at its name in the `density` group, and an alias can't be given where it is. The type of a key that is
    // a parameter can't be followed through the tokens, so this is the one place that trusts it. What the library could change: an alias that is given
    // the group that it is in, as a second argument, so a token can refer to its siblings.
    const set = (tokens: Library.Context<Root>) => (tokens.density as Record<string, Library.Context<DensitySetTokens>>)[name];
    const adjustment = (tokens: Library.Context<Root>) => (tokens.density as { adjustmentUnits: Library.Context<DesignToken.Number> }).adjustmentUnits;

    const axis = (
        axis: "horizontal" | "vertical",
        paddingUnits: number,
        gapUnits: number,
        padding: StyleProperty[]
    ): Library.Config<DensityAxisTokens, Root> => {
        // The units and the adjustment are added before the multiply, as they were.
        const calculated = (tokens: Library.Context<Root>, units: "paddingUnits" | "gapUnits") =>
            multiply(add(ref(set(tokens)[axis][units]), ref(adjustment(tokens))), ref(set(tokens).designUnit));

        return {
            paddingUnits: { $type: DesignToken.Type.Number, $value: paddingUnits },
            padding: {
                $type: AdaptiveDesignToken.expression,
                $value: tokens => subtract(calculated(tokens, "paddingUnits"), ref(set(tokens).borderThickness)),
                $extensions: intendedFor(...padding),
            },
            gapUnits: { $type: DesignToken.Type.Number, $value: gapUnits },
            gap: {
                $type: AdaptiveDesignToken.expression,
                $value: tokens => calculated(tokens, "gapUnits"),
                $extensions: intendedFor(StyleProperty.gap),
            },
        };
    };

    const config: Library.Config<DensitySetTokens, Root> = {
        designUnit: { $type: DesignToken.Type.Dimension, $value: designUnit },
        borderThickness: {
            $type: DesignToken.Type.Dimension,
            $value: borderThickness,
            $extensions: intendedFor(...StylePropertyShorthand.borderThickness),
        },
        horizontal: axis("horizontal", units.horizontalPadding, units.horizontalGap, [StyleProperty.paddingRight, StyleProperty.paddingLeft]),
        vertical: axis("vertical", units.verticalPadding, units.verticalGap, [StyleProperty.paddingTop, StyleProperty.paddingBottom]),
    };
    return { [name]: config } as Library.Config<{ [K in N]: DensitySetTokens }, Root>;
}
