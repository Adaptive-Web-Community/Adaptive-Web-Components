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
import { InteractiveState, InteractiveTokenGroup } from "./types.js";

/**
 * Creates a DesignToken that can be used for interactive color recipe deltas.
 *
 * @param baseName - The base token name in `css-identifier` casing.
 * @param state - The state for the recipe delta value, or a custom identifier in camelCase.
 * @param value - The value for the recipe delta.
 *
 * @public
 */
export function createTokenDelta(
    baseName: string,
    state: InteractiveState | string,
    value: number | DesignToken<number>
): TypedDesignToken<number> {
    return createTokenNonCss<number>(`${baseName}.${state}Delta`, DesignTokenType.number).withDefault(value);
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
    return createTokenNonCss<number>(`${baseName}.minContrast`, DesignTokenType.number).withDefault(value);
}

/**
 * Creates a DesignToken that can be used for a color recipe, optionally referencing a context color.
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
    return createTokenNonCss<ColorRecipe<T>>(`${baseName}.recipe`, DesignTokenType.recipe, intendedFor).withDefault({
        evaluate
    });
}

/**
 * Creates a DesignToken that can be used for a color recipe, referencing an interactive color set for context.
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
    return createTokenNonCss<ColorRecipeBySet<T>>(`${baseName}.recipe`, DesignTokenType.recipe, intendedFor).withDefault({
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
    return createTokenNonCss<ColorRecipePalette<T>>(`${baseName}.recipe`, DesignTokenType.recipe, intendedFor).withDefault({
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
    const palettePrefix = paletteToken.name.replace(".palette", ""); // TODO: More resilient
    const recipeSuffix = recipeToken.name.replace("color.shared.", "");
    const name = `${palettePrefix}.${recipeSuffix}`;
    return createTokenNonCss<RecipeOptional<ColorRecipeParams, T>>(name, DesignTokenType.recipe, recipeToken.intendedFor).withDefault({
        evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): T => {
            const p = Object.assign({ palette: resolve(paletteToken) }, params);
            return resolve(recipeToken).evaluate(resolve, p)
        }
    });
}

function createTokenColorSetState(
    valueToken: TypedDesignToken<InteractiveSwatchSet>,
    state: InteractiveState,
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${valueToken.name.replace(".value", "")}.${state}`, valueToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state] as any
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
    const name = recipeToken.name.replace(".recipe", "");
    const valueToken = createTokenNonCss<InteractiveSwatchSet>(`${name}.value`, DesignTokenType.color, recipeToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
    return {
        name,
        type: DesignTokenType.color,
        intendedFor: valueToken.intendedFor,
        rest: createTokenColorSetState(valueToken, InteractiveState.rest),
        hover: createTokenColorSetState(valueToken, InteractiveState.hover),
        active: createTokenColorSetState(valueToken, InteractiveState.active),
        focus: createTokenColorSetState(valueToken, InteractiveState.focus),
        disabled: createTokenColorSetState(valueToken, InteractiveState.disabled),
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
    return createTokenSwatch(`${recipeToken.name.replace(".recipe", "")}.value`, recipeToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
}

/**
 * Creates an {@link InteractiveTokenGroup} from the `rest` state of the foreground set
 * to be applied over the interactive background tokens.
 *
 * @param foregroundRecipe - The recipe for the foreground.
 * @param background - The interactive token group for the background.
 *
 * @public
 */
export function createForegroundSet(
    foregroundRecipe: TypedDesignToken<InteractiveColorRecipe>,
    background: InteractiveTokenGroup<Swatch>,
): InteractiveTokenGroup<Swatch> {
    const foregroundBaseName = `${foregroundRecipe.name.replace(".recipe", "")}`;
    const setName = `${foregroundBaseName}.on.${background.name.replace("color.", "")}`;

    function createState(
        foregroundState: InteractiveState,
        state: InteractiveState,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}.${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(foregroundRecipe).evaluate(resolve, {
                    reference: resolve(background[state])
                })[foregroundState] as any
        );
    }

    return {
        name: setName,
        type: DesignTokenType.color,
        intendedFor: foregroundRecipe.intendedFor,
        rest: createState(InteractiveState.rest, InteractiveState.rest),
        hover: createState(InteractiveState.rest, InteractiveState.hover),
        active: createState(InteractiveState.rest, InteractiveState.active),
        focus: createState(InteractiveState.rest, InteractiveState.focus),
        disabled: createState(InteractiveState.disabled, InteractiveState.disabled),
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
    const foregroundBaseName = foregroundRecipe.name.replace(".recipe", "");
    const setName = `${foregroundBaseName}.on.${background.name.replace("color.", "")}`;

    const set = createTokenNonCss<InteractiveSwatchSet>(`${setName}.value`, DesignTokenType.color).withDefault(
        (resolve: DesignTokenResolver) =>
            {
                const backgroundSet: InteractiveSwatchSet = {
                    rest: resolve(background.rest),
                    hover: resolve(background.hover),
                    active: resolve(background.active),
                    focus: resolve(background.focus),
                    disabled: resolve(background.disabled),
                }
                return resolve(foregroundRecipe).evaluate(resolve, backgroundSet);
            }
    );

    function createState(
        state: InteractiveState,
    ): TypedCSSDesignToken<Swatch> {
        return createTokenSwatch(`${setName}.${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(set)[state] as any
        );
    }

    return {
        name: setName,
        intendedFor: foregroundRecipe.intendedFor,
        type: DesignTokenType.color,
        rest: createState(InteractiveState.rest),
        hover: createState(InteractiveState.hover),
        active: createState(InteractiveState.active),
        focus: createState(InteractiveState.focus),
        disabled: createState(InteractiveState.disabled),
    };
}
