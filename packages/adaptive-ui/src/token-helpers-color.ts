import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import {
    ColorRecipe,
    ColorRecipeBySet,
    ColorRecipeBySetEvaluate,
    ColorRecipeEvaluate,
    ColorRecipePalette,
    ColorRecipePaletteEvaluate,
    ColorRecipePaletteParams,
    ColorRecipeParams,
    InteractiveColorRecipe,
    InteractiveColorRecipeBySet,
    InteractiveSwatchSet,
} from "./color/recipe.js";
import { Palette } from "./color/palette.js";
import { Swatch } from "./color/swatch.js";
import { StyleProperty } from "./modules/types.js";
import { DesignTokenType, TypedCSSDesignToken, TypedDesignToken } from "./adaptive-design-tokens.js";
import { Recipe, RecipeOptional } from "./recipes.js";
import { createTokenNonCss, createTokenSwatch } from "./token-helpers.js";
import type { InteractiveSet, InteractiveTokenGroup } from "./types.js";

/**
 * Creates a DesignToken that can be used for interactive color recipe deltas.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param state - The state for the recipe delta value.
 * @param value - The value for the recipe delta.
 *
 * @public
 */
export function createTokenDelta(
    baseName: string,
    state: keyof InteractiveSwatchSet,
    value: number | DesignToken<number>
): TypedDesignToken<number> {
    return createTokenNonCss<number>(`${baseName}-${state}-delta`, DesignTokenType.number).withDefault(value);
}

/**
 * Creates a DesignToken that can be used for color recipe minimum contrast.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param value - The value for the recipe minimum contrast.
 *
 * @public
 */
export function createTokenMinContrast(
    baseName: string,
    value: number | DesignToken<number>
): TypedDesignToken<number> {
    return createTokenNonCss<number>(`${baseName}-min-contrast`, DesignTokenType.number).withDefault(value);
}

/**
 * Creates a DesignToken that can be used for a color recipe.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 * @param evaluate - The function to call when the derived token needs to be evaluated.
 *
 * @public
 */
export function createTokenColorRecipe<T = Swatch>(
    baseName: string,
    intendedFor: StyleProperty | StyleProperty[],
    evaluate: ColorRecipeEvaluate<T>,
): TypedDesignToken<ColorRecipe<T>> {
    return createTokenNonCss<ColorRecipe<T>>(`${baseName}-recipe`, DesignTokenType.recipe, intendedFor).withDefault({
        evaluate
    });
}

/**
 * Creates a DesignToken that can be used for a color recipe, based on another interactive color set.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 * @param evaluate - The function to call when the derived token needs to be evaluated.
 *
 * @public
 */
export function createTokenColorRecipeBySet<T = Swatch>(
    baseName: string,
    intendedFor: StyleProperty | StyleProperty[],
    evaluate: ColorRecipeBySetEvaluate<T>,
): TypedDesignToken<ColorRecipeBySet<T>> {
    return createTokenNonCss<ColorRecipeBySet<T>>(`${baseName}-recipe`, DesignTokenType.recipe, intendedFor).withDefault({
        evaluate
    });
}

/**
 * Creates a DesignToken that can be used for a color recipe that works with different {@link Palette}s.
 * Use in conjunction with {@link createTokenColorRecipeWithPalette}.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param intendedFor - The style properties where this token is intended to be used.
 * @param evaluate - The function to call when the derived token needs to be evaluated.
 *
 * @public
 */
export function createTokenColorRecipeForPalette<T = Swatch>(
    baseName: string,
    intendedFor: StyleProperty | StyleProperty[],
    evaluate: ColorRecipePaletteEvaluate<T>,
): TypedDesignToken<ColorRecipePalette<T>> {
    return createTokenNonCss<ColorRecipePalette<T>>(`${baseName}-recipe`, DesignTokenType.recipe, intendedFor).withDefault({
        evaluate
    });
}

/**
 * Creates a DesignToken that can be used for a specific {@link Palette} configuration of a shared color recipe.
 *
 * @param recipeToken - The shared token, typically from {@link createTokenColorRecipeForPalette}.
 * @param paletteToken - The {@link Palette} token.
 *
 * @public
 */
export function createTokenColorRecipeWithPalette<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
    paletteToken: DesignToken<Palette>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    const palettePrefix = paletteToken.name.split("-")[0] + "-"; // TODO: More resilient
    const name = palettePrefix + recipeToken.name;
    return createTokenNonCss<RecipeOptional<ColorRecipeParams, T>>(name, DesignTokenType.recipe, recipeToken.intendedFor).withDefault({
        evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): T => {
            const p = Object.assign({ palette: resolve(paletteToken) }, params);
            return resolve(recipeToken).evaluate(resolve, p)
        }
    });
}

function createTokenColorSetState(
    valueToken: TypedDesignToken<InteractiveSwatchSet>,
    state: keyof InteractiveSwatchSet,
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${valueToken.name.replace("-value", "")}-${state}`, valueToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state]
    );
}

/**
 * Creates a TokenGroup that can be used for the evaluated value of an interactive color recipe.
 *
 * @param recipeToken - The interactive color recipe token.
 *
 * @public
 */
export function createTokenColorSet(
    recipeToken: TypedDesignToken<InteractiveColorRecipe>
): InteractiveTokenGroup<Swatch> {
    const name = recipeToken.name.replace("-recipe", "");
    const valueToken = createTokenNonCss<InteractiveSwatchSet>(`${name}-value`, DesignTokenType.color, recipeToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
    return {
        name,
        type: DesignTokenType.color,
        intendedFor: valueToken.intendedFor,
        rest: createTokenColorSetState(valueToken, "rest"),
        hover: createTokenColorSetState(valueToken, "hover"),
        active: createTokenColorSetState(valueToken, "active"),
        focus: createTokenColorSetState(valueToken, "focus"),
    };
}

/**
 * Creates a DesignToken that can be used for the resulting color value from a recipe in styles.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeValue(
    recipeToken: TypedDesignToken<ColorRecipe<Swatch>>,
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${recipeToken.name.replace("-recipe", "")}`, recipeToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
}

/**
 * Creates a TokenGroup of a single state from a set of foreground tokens to be applied over the interactive background tokens.
 *
 * @param foregroundRecipe - The recipe for the foreground.
 * @param foregroundState - The state from the foreground recipe, typically "rest".
 * @param background - The interactive token group for the background.
 *
 * @public
 */
export function createForegroundSet(
    foregroundRecipe: TypedDesignToken<InteractiveColorRecipe>,
    foregroundState: keyof InteractiveSet<any>,
    background: InteractiveTokenGroup<Swatch>,
): InteractiveTokenGroup<Swatch> {
    const foregroundBaseName = `${foregroundRecipe.name.replace("-recipe", "")}-${foregroundState}`;
    const backgroundBaseName = background.rest.name.replace("-rest", "");
    const setName = `${foregroundBaseName}-on-${backgroundBaseName}`;

    function createState(
        state: keyof InteractiveSet<any>,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(foregroundRecipe).evaluate(resolve, {
                    reference: resolve(background[state])
                })[foregroundState]
        );
    }

    return {
        name: setName,
        type: DesignTokenType.color,
        intendedFor: foregroundRecipe.intendedFor,
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}

/**
 * Creates a TokenGroup of a set of interactive foreground tokens to be applied over the interactive background tokens.
 *
 * @param foregroundRecipe - The recipe for the foreground.
 * @param background - The interactive token group for the background.
 *
 * @public
 */
export function createForegroundSetBySet(
    foregroundRecipe: TypedDesignToken<InteractiveColorRecipeBySet>,
    background: InteractiveTokenGroup<Swatch>,
): InteractiveTokenGroup<Swatch> {
    const foregroundBaseName = foregroundRecipe.name.replace("-recipe", "");
    const backgroundBaseName = background.rest.name.replace("-rest", "");
    const setName = `${foregroundBaseName}-on-${backgroundBaseName}`;

    const set = createTokenNonCss<InteractiveSwatchSet>(`${setName}-value`, DesignTokenType.color).withDefault(
        (resolve: DesignTokenResolver) =>
            {
                const backgroundSet: InteractiveSwatchSet = {
                    rest: resolve(background.rest),
                    hover: resolve(background.hover),
                    active: resolve(background.active),
                    focus: resolve(background.focus),
                }
                return resolve(foregroundRecipe).evaluate(resolve, backgroundSet);
            }
    );

    function createState(
        state: keyof InteractiveSet<any>,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}-${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(set)[state]
        );
    }

    return {
        name: setName,
        intendedFor: foregroundRecipe.intendedFor,
        type: DesignTokenType.color,
        rest: createState("rest"),
        hover: createState("hover"),
        active: createState("active"),
        focus: createState("focus")
    };
}
