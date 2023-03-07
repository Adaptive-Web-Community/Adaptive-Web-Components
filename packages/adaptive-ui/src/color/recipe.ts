import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { Swatch } from "./swatch.js";

/**
 * A recipe that evaluates a single color value.
 *
 * @public
 */
export interface ColorRecipe<T = Swatch> {
    /**
     * Evaluate a color recipe.
     *
     * @param resolver - A function that resolves design tokens
     * @param reference - The reference color, implementation defaults to `fillColor`, but sometimes overridden for nested color recipes
     */
    evaluate(resolver: DesignTokenResolver, reference?: Swatch): T;
}

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export interface InteractiveColorRecipe extends ColorRecipe<InteractiveSwatchSet> {}

/**
 * A set of {@link Swatch}es to use for an interactive control's states.
 *
 * @public
 */
export interface InteractiveSwatchSet {
    /**
     * The Swatch to apply to the rest state.
     */
    rest: Swatch;

    /**
     * The Swatch to apply to the hover state.
     */
    hover: Swatch;

    /**
     * The Swatch to apply to the active state.
     */
    active: Swatch;

    /**
     * The Swatch to apply to the focus state.
     */
    focus: Swatch;
}
