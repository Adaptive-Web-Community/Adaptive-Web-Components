import { CSSDirective, cssDirective } from "@microsoft/fast-element";
import { DesignTokenMultiValue, DesignTokenType } from "../adaptive-design-tokens.js";
import { Swatch } from "../color/swatch.js";
import { StyleProperty } from "../modules/types.js";
import { createTyped } from "../token-helpers.js";

/**
 * The definition of a shadow for `box-shadow`, `text-shadow`, or `drop-shadow` values.
 *
 * @public
 */
@cssDirective()
export class Shadow implements CSSDirective {
    /**
     * Creates a new Shadow.
     *
     * @param color - The color of the shadow.
     * @param xOffset - The x offset in `px`.
     * @param yOffset - The y offset in `px`.
     * @param blurRadius - The blur radius in `px`.
     * @param spread - The spread in `px`. This is not supported in all potential uses of Shadow (text or drop).
     */
    constructor(
        public color: Swatch,
        public xOffset: number,
        public yOffset: number,
        public blurRadius?: number,
        public spread?: number,
    ) {
    }

    /**
     * {@inheritdoc CSSDirective.createCSS}
     */
    public createCSS(): string {
        const values = [
            `${this.xOffset}px`,
            `${this.yOffset}px`,
        ];
        if (this.blurRadius) {
            values.push(`${this.blurRadius}px`);
        }
        if (this.spread) {
            values.push(`${this.spread}px`);
        }
        values.push(this.color.toColorString());
        return values.join(" ");
    }
}

/**
 * The type of a Shadow token value.
 *
 * @public
 */
export type ShadowValue = Shadow | DesignTokenMultiValue<Shadow> | string;

/**
 * Creates a DesignToken that can be used for Shadow value.
 *
 * @param name - The token name in `css-identifier` casing.
 *
 * @public
 */
export const createTokenShadow = (name: string) =>
    createTyped<ShadowValue>(name, DesignTokenType.shadow, StyleProperty.shadow);
