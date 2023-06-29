import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { TypedCSSDesignToken } from "../adaptive-design-tokens.js";
import { TokenGroup } from "../types.js";
import { designUnitDimension, strokeThickness } from "../design-tokens/appearance.js";
import { createNonCss, createTokenDimension } from "../token-helpers.js";

/**
 * The adjustment (plus or minus) to density unit values.
 *
 * @remarks
 * Ex: `-1` to reduce all density values.
 * Positive or negative values, may be fractional.
 * Note that _this_ value is additive, not a multiplier, thus `0` has no effect, while `1` adds a unit.
 *
 * @defaultValue 0
 *
 * @public
 */
export const densityAdjustmentUnits = createNonCss<number>(
    "density-adjustment-units"
).withDefault(0);

/**
 * A model for defining component density using padding (spaced around the inside of the component bounds)
 * and gap (space between elements within a component).
 *
 * @public
 */
export class DensityPaddingAndGapTokenGroup implements TokenGroup {
    /**
     * The design unit multiplier for control density horizontal padding.
     *
     * @remarks
     * Ex: `3` to set the padding to 3 units.
     * Positive values, may be fractional.
     *
     * @public
     */
    public readonly horizontalPaddingUnits: DesignToken<number>;

    /**
     * The calculated measurement for control horizontal padding, adjusted for border thickness.
     *
     * @remarks
     * Calculated from `horizontalPaddingUnits`, `designUnit`, and `strokeThickness`.
     *
     * @public
     */
    public readonly horizontalPadding: TypedCSSDesignToken<string>;

    /**
     * The design unit multiplier for control density horizontal gap between elements.
     *
     * @remarks
     * Ex: `2` to set the gap to 2 units.
     * May be fractional.
     *
     * @public
     */
    public readonly horizontalGapUnits: DesignToken<number>;

    /**
     * The calculated measurement for the horizontal gap between elements within a control.
     *
     * @remarks
     * This is useful as a `gap` for `flex` layouts or as a `margin` on elements next to other elements.
     *
     * @public
     */
    public readonly horizontalGap: TypedCSSDesignToken<string>;

    /**
     * The design unit multiplier for control density vertical padding.
     *
     * @remarks
     * Ex: `2` to set the padding to 2 units.
     * May be fractional.
     *
     * @public
     */
    public readonly verticalPaddingUnits: DesignToken<number>;

    /**
     * The calculated measurement for control vertical padding, adjusted for border thickness.
     *
     * @remarks
     * Calculated from `verticalPaddingUnits`, `designUnit`, and `strokeThickness`.
     *
     * @public
     */
    public readonly verticalPadding: TypedCSSDesignToken<string>;

    /**
     * The design unit multiplier for control density vertical gap between elements.
     *
     * @remarks
     * Ex: `2` to set the gap to 2 units.
     * May be fractional.
     *
     * @public
     */
    public readonly verticalGapUnits: DesignToken<number>;

    /**
     * The calculated measurement for the vertical gap between elements within a control.
     *
     * @remarks
     * This is useful as a `gap` for `flex` layouts or as a `margin` on elements next to other elements.
     *
     * @public
     */
    public readonly verticalGap: TypedCSSDesignToken<string>;

    /**
     * Creates a new token group with the specified unit values and default calculations.
     *
     * @param name - The base name of the token group.
     * @param horizontalPaddingUnits - The initial value, ex: `3`.
     * @param horizontalGapUnits - The initial value, ex: `1`.
     * @param verticalPaddingUnits - The initial value, ex: `2`.
     * @param verticalGapUnits - The initial value, ex: `1`.
     */
    constructor(
        public readonly name: string,
        horizontalPaddingUnits: number,
        horizontalGapUnits: number,
        verticalPaddingUnits: number,
        verticalGapUnits: number,
    ) {
        this.horizontalPaddingUnits = createNonCss<number>(
            `${name}-horizontal-padding-units`
        ).withDefault(horizontalPaddingUnits);

        this.horizontalPadding = createTokenDimension(
            `${name}-horizontal-padding`
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(((${resolve(this.horizontalPaddingUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(designUnitDimension)}) - ${resolve(strokeThickness)})`
        );

        this.horizontalGapUnits = createNonCss<number>(
            `${name}-horizontal-gap-units`
        ).withDefault(horizontalGapUnits);

        this.horizontalGap = createTokenDimension(
            `${name}-horizontal-gap`
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.horizontalGapUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(designUnitDimension)})`
        );

        this.verticalPaddingUnits = createNonCss<number>(
            `${name}-vertical-padding-units`
        ).withDefault(verticalPaddingUnits);

        this.verticalPadding = createTokenDimension(
            `${name}-vertical-padding`
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc(((${resolve(this.verticalPaddingUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(designUnitDimension)}) - ${resolve(strokeThickness)})`
        );

        this.verticalGapUnits = createNonCss<number>(
            `${name}-vertical-gap-units`
        ).withDefault(verticalGapUnits);

        this.verticalGap = createTokenDimension(
            "density-control-vertical-gap"
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.verticalGapUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(designUnitDimension)})`
        );
    }
}
