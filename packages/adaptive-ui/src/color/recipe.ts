import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { InteractiveSet } from "../types.js";
import { Swatch } from "./swatch.js";

/**
 * A recipe that evaluates based on a single optional reference color value.
 *
 * @public
 */
export interface ColorRecipe<T = Swatch> {
    /**
     * Evaluate a color recipe.
     *
     * @param resolver - A function that resolves design tokens
     * @param reference - The reference color, implementation defaults to `fillColor`, but allows for overriding for nested color recipes
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
export interface InteractiveSwatchSet extends InteractiveSet<Swatch> {}

/**
 * A recipe that evaluates based on an interactive set of color values.
 * 
 * @remarks
 * This offers more control than {@link ColorRecipe} for cases where the recipe needs to take the full set into consideration.
 *
 * @public
 */
export interface ColorRecipeBySet<T = InteractiveSwatchSet> {
    /**
     * Evaluate a color recipe set.
     *
     * @param resolver - A function that resolves design tokens
     * @param reference - The reference set, since there is no equivalent to `fillColor` here, it must be provided
     */
    evaluate(resolver: DesignTokenResolver, reference: InteractiveSwatchSet): T;
}

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export interface InteractiveColorRecipeBySet extends ColorRecipeBySet {}
