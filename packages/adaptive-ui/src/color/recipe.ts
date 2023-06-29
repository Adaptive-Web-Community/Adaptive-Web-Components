import { Recipe, RecipeEvaluate, RecipeEvaluateOptional, RecipeOptional } from "../recipes.js";
import { InteractiveSet } from "../types.js";
import { Palette } from "./palette.js";
import { Swatch } from "./swatch.js";

/**
 * Parameters provided to {@link ColorRecipe}.
 *
 * @public
 */
export type ColorRecipeParams = {
    /**
     * The reference color, implementation defaults to `fillColor`, but allows for overriding for nested color recipes.
     */
    reference?: Swatch,
};

/**
 * A recipe that evaluates based on {@link ColorRecipeParams}.
 *
 * @public
 */
export type ColorRecipe<T = Swatch> = RecipeOptional<ColorRecipeParams, T>;

/**
 * The type of the `evaluate` function for {@link ColorRecipe}.
 *
 * @public
 */
export type ColorRecipeEvaluate<T = Swatch> = RecipeEvaluateOptional<ColorRecipeParams, T>;

/**
 * Parameters provided to {@link ColorRecipePalette}.
 * @public
 */
export type ColorRecipePaletteParams = ColorRecipeParams & {
    /**
     * The Palette to provide to the recipe.
     */
    palette: Palette,
};

/**
 * A recipe that evaluates based on {@link ColorRecipePaletteParams}.
 *
 * @public
 */
export type ColorRecipePalette<T = Swatch> = Recipe<ColorRecipePaletteParams, T>;

/**
 * The type of the `evaluate` function for {@link ColorRecipePalette}.
 *
 * @public
 */
export type ColorRecipePaletteEvaluate<T = Swatch> = RecipeEvaluate<ColorRecipePaletteParams, T>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export type InteractiveColorRecipe = ColorRecipe<InteractiveSwatchSet>;

/**
 * The type of the `evaluate` function for {@link InteractiveColorRecipe}.
 *
 * @public
 */
export type InteractiveColorRecipeEvaluate = ColorRecipeEvaluate<InteractiveSwatchSet>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states using the provided Palette.
 *
 * @public
 */
export type InteractiveColorRecipePalette = ColorRecipePalette<InteractiveSwatchSet>;

/**
 * The type of the `evaluate` function for {@link InteractiveColorRecipePalette}.
 *
 * @public
 */
export type InteractiveColorRecipePaletteEvaluate = ColorRecipePaletteEvaluate<InteractiveSwatchSet>;

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
export type ColorRecipeBySet<T = Swatch> = Recipe<InteractiveSwatchSet, T>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export type InteractiveColorRecipeBySet = ColorRecipeBySet<InteractiveSwatchSet>;
