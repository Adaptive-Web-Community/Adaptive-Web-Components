import { css, type CSSDirective } from "@microsoft/fast-element";
import type { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignToken } from "@microsoft/fast-foundation";
import { DesignTokenType, TypedCSSDesignToken, TypedDesignToken } from "../adaptive-design-tokens.js";
import { TokenGroup } from "../types.js";
import { createTokenDimension, createTokenNonCss } from "../token-helpers.js";
import { StyleProperty, stylePropertyBorderThicknessAll } from "../modules/types.js";

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
export const densityAdjustmentUnits = createTokenNonCss<number>(
    "density-adjustment-units",
    DesignTokenType.number,
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
    public readonly horizontalPaddingUnits: TypedDesignToken<number>;

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
    public readonly horizontalGapUnits: TypedDesignToken<number>;

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
    public readonly verticalPaddingUnits: TypedDesignToken<number>;

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
    public readonly verticalGapUnits: TypedDesignToken<number>;

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
     * The dimension of a design unit for density calculation.
     *
     * @public
     */
    public readonly designUnit: TypedCSSDesignToken<string>;

    /**
     * The dimension of the border for density calculation.
     *
     * @public
     */
    public readonly borderThickness: TypedCSSDesignToken<string>;

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
        designUnit: string | DesignToken<string>,
        borderThickness: string | DesignToken<string>,
    ) {
        this.horizontalPaddingUnits = createTokenNonCss<number>(
            `${name}-horizontal-padding-units`,
            DesignTokenType.number,
        ).withDefault(horizontalPaddingUnits);

        this.horizontalPadding = createTokenDimension(
            `${name}-horizontal-padding`,
            [StyleProperty.paddingRight, StyleProperty.paddingLeft],
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.horizontalPaddingUnits) + resolve(densityAdjustmentUnits)} * ${resolve(this.designUnit)}) - ${resolve(this.borderThickness)})`
        );

        this.horizontalGapUnits = createTokenNonCss<number>(
            `${name}-horizontal-gap-units`,
            DesignTokenType.number,
        ).withDefault(horizontalGapUnits);

        this.horizontalGap = createTokenDimension(
            `${name}-horizontal-gap`,
            StyleProperty.gap,
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.horizontalGapUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(this.designUnit)})`
        );

        this.verticalPaddingUnits = createTokenNonCss<number>(
            `${name}-vertical-padding-units`,
            DesignTokenType.number,
        ).withDefault(verticalPaddingUnits);

        this.verticalPadding = createTokenDimension(
            `${name}-vertical-padding`,
            [StyleProperty.paddingTop, StyleProperty.paddingBottom],
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.verticalPaddingUnits) + resolve(densityAdjustmentUnits)} * ${resolve(this.designUnit)}) - ${resolve(this.borderThickness)})`
        );

        this.verticalGapUnits = createTokenNonCss<number>(
            `${name}-vertical-gap-units`,
            DesignTokenType.number,
        ).withDefault(verticalGapUnits);

        this.verticalGap = createTokenDimension(
            `${name}-vertical-gap`,
            StyleProperty.gap,
        ).withDefault(
            (resolve: DesignTokenResolver) =>
                `calc((${resolve(this.verticalGapUnits)} + ${resolve(densityAdjustmentUnits)}) * ${resolve(this.designUnit)})`
        );

        this.designUnit = createTokenDimension(`${name}-design-unit`).withDefault(designUnit);

        this.borderThickness = createTokenDimension(`${name}-border-thickness`, stylePropertyBorderThicknessAll).withDefault(borderThickness);
    }

    /**
     * Convenience accessor for vertical and horizontal padding, adjusted for border thickness.
     *
     * @remarks
     * Convenience combination of `verticalPadding` and `horizontalPadding`.
     *
     * @public
     */
    public get padding(): CSSDirective {
        return css.partial`${this.verticalPadding} ${this.horizontalPadding}`;
    }
}
