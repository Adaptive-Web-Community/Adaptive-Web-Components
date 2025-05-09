import { Recipe, RecipeEvaluate, RecipeEvaluateOptional, RecipeOptional } from "../recipes.js";
import { InteractiveValues } from "../types.js";
import { Color } from "./color.js";
import { Paint } from "./paint.js";
import { Palette } from "./palette.js";

/**
 * Parameters provided to {@link ColorRecipe}.
 *
 * @public
 */
export type ColorRecipeParams = {
    /**
     * The reference color, implementation defaults to `fillColor`, but allows for overriding for nested color recipes.
     */
    reference: Paint | null,
};

/**
 * A recipe that evaluates based on {@link ColorRecipeParams}.
 *
 * @public
 */
export type ColorRecipe<T = Color> = RecipeOptional<ColorRecipeParams, T>;

/**
 * The type of the `evaluate` function for {@link ColorRecipe}.
 *
 * @public
 */
export type ColorRecipeEvaluate<T = Color> = RecipeEvaluateOptional<ColorRecipeParams, T>;

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
export type ColorRecipePalette<T = Color> = Recipe<ColorRecipePaletteParams, T>;

/**
 * The type of the `evaluate` function for {@link ColorRecipePalette}.
 *
 * @public
 */
export type ColorRecipePaletteEvaluate<T = Color> = RecipeEvaluate<ColorRecipePaletteParams, T>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export type InteractiveColorRecipe = ColorRecipe<InteractivePaintSet>;

/**
 * The type of the `evaluate` function for {@link InteractiveColorRecipe}.
 *
 * @public
 */
export type InteractiveColorRecipeEvaluate = ColorRecipeEvaluate<InteractivePaintSet>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states using the provided Palette.
 *
 * @public
 */
export type InteractiveColorRecipePalette = ColorRecipePalette<InteractivePaintSet>;

/**
 * The type of the `evaluate` function for {@link InteractiveColorRecipePalette}.
 *
 * @public
 */
export type InteractiveColorRecipePaletteEvaluate = ColorRecipePaletteEvaluate<InteractivePaintSet>;

/**
 * A set of {@link Paint}s to use for an interactive control's states.
 *
 * @public
 */
export interface InteractivePaintSet extends InteractiveValues<Paint | null> {}

/**
 * A set of {@link Color}s to use for an interactive control's states.
 *
 * @public
 */
export interface InteractiveColorSet extends InteractiveValues<Color | null> {}

/**
 * A recipe that evaluates based on an interactive set of color values.
 *
 * @remarks
 * This offers more control than {@link ColorRecipe} for cases where the recipe needs to take the full set into consideration.
 *
 * @public
 */
export type ColorRecipeBySet<T = Color> = Recipe<InteractivePaintSet, T>;

/**
 * The type of the `evaluate` function for {@link ColorRecipeBySet}.
 *
 * @public
 */
export type ColorRecipeBySetEvaluate<T = Color> = RecipeEvaluate<InteractivePaintSet, T>;

/**
 * A recipe that evaluates a color value for rest, hover, active, and focus states.
 *
 * @public
 */
export type InteractiveColorRecipeBySet = ColorRecipeBySet<InteractivePaintSet>;

/**
 * The type of the `evaluate` function for {@link InteractiveColorRecipeBySet}.
 *
 * @public
 */
export type InteractiveColorRecipeBySetEvaluate = ColorRecipeBySetEvaluate<InteractivePaintSet>;
