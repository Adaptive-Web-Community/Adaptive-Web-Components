import { DesignTokenResolver } from "@microsoft/fast-foundation";

/**
 * @public
 */
export type RecipeEvaluate<TParam, TResult> = (resolver: DesignTokenResolver, params: TParam) => TResult;

/**
 * @public
 */
export type RecipeEvaluateOptional<TParam, TResult> = (resolver: DesignTokenResolver, params?: TParam) => TResult;

/**
 * A `Recipe` is a derived `DesignToken` value that enables reusable _and_ customizable design logic.
 *
 * @public
 */
export interface Recipe<TParam, TResult> {
    /**
     * Evaluate a recipe.
     *
     * @param resolver - A function that resolves design tokens.
     * @param params - Any params that are needed to evaluate.
     */
    evaluate: RecipeEvaluate<TParam, TResult>;
}

/**
 * A `Recipe` is a derived `DesignToken` value that enables reusable _and_ customizable design logic.
 *
 * @public
 */
export interface RecipeOptional<TParam, TResult> {
    /**
     * Evaluate a recipe.
     *
     * @param resolver - A function that resolves design tokens.
     * @param params - Any params that are optional for evaluation.
     */
    evaluate: RecipeEvaluateOptional<TParam, TResult>;
}
