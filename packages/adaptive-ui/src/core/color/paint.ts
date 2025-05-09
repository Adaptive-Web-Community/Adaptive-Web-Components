import { AddBehavior, ComposableStyles, CSSDirective } from "@microsoft/fast-element";
import { DesignTokenMultiValue } from "../adaptive-design-tokens.js";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Abstract representation of a value which can be used to paint a style like a fill or border.
 *
 * See {@link Color} of {@link Gradient} for concrete implementations.
 *
 * @public
 */
export abstract class PaintBase implements RelativeLuminance, CSSDirective {
    readonly #relativeLuminance: number;

    /**
     * Creates a new Color.
     *
     * @param color - The underlying Color value
     */
    protected constructor(relativeLuminance: number) {
        this.#relativeLuminance = relativeLuminance;
    }

    /**
     * Creates a CSS fragment to interpolate into the CSS document.
     *
     * @returns - the string to interpolate into CSS
     */
    createCSS(add: AddBehavior): ComposableStyles {
        throw new Error("Method not implemented.");
    }

    /**
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    public get relativeLuminance(): number {
        return this.#relativeLuminance;
    }

    /**
     * {@inheritdoc RelativeLuminance.contrast}
     */
    public contrast(b: RelativeLuminance): number {
        return contrast(this, b);
    }
}

/**
 * A design token value for paint purposes which can have multiple values, like `background`.
 *
 * @public
 */
export class DesignTokenMultiValuePaint extends DesignTokenMultiValue<PaintBase> implements RelativeLuminance {
    /**
     * {@inheritdoc RelativeLuminance.relativeLuminance}
     */
    public get relativeLuminance(): number {
        return this[0].relativeLuminance;
    }

    /**
     * {@inheritdoc RelativeLuminance.contrast}
     */
    public contrast(b: RelativeLuminance): number {
        return contrast(this, b);
    }
}

/**
 * The type of a Paint token value.
 *
 * @public
 */
export type Paint = PaintBase | DesignTokenMultiValuePaint;
