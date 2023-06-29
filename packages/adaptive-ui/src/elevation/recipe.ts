import { Recipe, RecipeEvaluate } from "../recipes.js";

/**
 * A recipe that evaluates to an elevation treatment, commonly, but not limited to, a box shadow.
 *
 * @public
 */
export type ElevationRecipe = Recipe<number, string>;

/**
 * The type of the `evaluate` function for {@link ElevationRecipe}.
 *
 * @public
 */
export type ElevationRecipeEvaluate = RecipeEvaluate<number, string>;
