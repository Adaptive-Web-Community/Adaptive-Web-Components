import { AddBehavior, ComposableStyles, CSSDirective } from "@microsoft/fast-element";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Abstract representation of a value which can be used to paint a style like a fill or border.
 *
 * See {@link Color} for concrete implementation.
 *
 * @public
 */
export abstract class Paint implements RelativeLuminance, CSSDirective {
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

    public contrast(b: RelativeLuminance): number {
        return contrast(this, b);
    }
}
