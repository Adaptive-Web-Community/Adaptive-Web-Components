import type { DesignToken, DesignTokenResolver } from "@microsoft/fast-foundation";
import { Paint } from "./color/paint.js";
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
    InteractivePaintSet,
} from "./color/recipe.js";
import { Palette } from "./color/palette.js";
import { StyleProperty } from "./modules/types.js";
import { DesignTokenRegistry, DesignTokenType, TypedCSSDesignToken, TypedDesignToken } from "./adaptive-design-tokens.js";
import { Recipe, RecipeOptional } from "./recipes.js";
import { createTokenNonCss, createTokenPaint } from "./token-helpers.js";
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
export function createTokenColorRecipe<T = Paint>(
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
export function createTokenColorRecipeBySet<T = Paint>(
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
export function createTokenColorRecipeForPalette<T = Paint>(
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
export function createTokenColorRecipeWithPalette<T = Paint>(
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

function createTokenPaintSetState(
    valueToken: TypedDesignToken<InteractivePaintSet>,
    state: InteractiveState,
): TypedCSSDesignToken<Paint> {
    return createTokenPaint(`${valueToken.name.replace(".value", "")}.${state}`, valueToken.intendedFor).withDefault(
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
): InteractiveTokenGroup<Paint> {
    const name = recipeToken.name.replace(".recipe", "");
    const valueToken = createTokenNonCss<InteractivePaintSet>(`${name}.value`, DesignTokenType.color, recipeToken.intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );

    const group = {
        name,
        type: DesignTokenType.color,
        intendedFor: valueToken.intendedFor,
        rest: createTokenPaintSetState(valueToken, InteractiveState.rest),
        hover: createTokenPaintSetState(valueToken, InteractiveState.hover),
        active: createTokenPaintSetState(valueToken, InteractiveState.active),
        focus: createTokenPaintSetState(valueToken, InteractiveState.focus),
        disabled: createTokenPaintSetState(valueToken, InteractiveState.disabled),
    };
    DesignTokenRegistry.Groups.set(name, group);
    return group;
}

/**
 * Creates a DesignToken that can be used for the resulting color value from a recipe in styles.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeValue(
    recipeToken: TypedDesignToken<ColorRecipe<Paint>>,
): TypedCSSDesignToken<Paint> {
    return createTokenPaint(`${recipeToken.name.replace(".recipe", "")}.value`, recipeToken.intendedFor).withDefault(
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
    background: InteractiveTokenGroup<Paint>,
): InteractiveTokenGroup<Paint> {
    const foregroundBaseName = `${foregroundRecipe.name.replace(".recipe", "")}`;
    const setName = `${foregroundBaseName}.on.${background.name.replace("color.", "")}`;

    function createState(
        foregroundState: InteractiveState,
        state: InteractiveState,
    ): TypedCSSDesignToken<Paint> {
        return createTokenPaint(`${setName}.${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(foregroundRecipe).evaluate(resolve, {
                    reference: resolve(background[state])
                })[foregroundState] as any
        );
    }

    const group = {
        name: setName,
        type: DesignTokenType.color,
        intendedFor: foregroundRecipe.intendedFor,
        rest: createState(InteractiveState.rest, InteractiveState.rest),
        hover: createState(InteractiveState.rest, InteractiveState.hover),
        active: createState(InteractiveState.rest, InteractiveState.active),
        focus: createState(InteractiveState.rest, InteractiveState.focus),
        disabled: createState(InteractiveState.disabled, InteractiveState.disabled),
    };
    DesignTokenRegistry.Groups.set(setName, group);
    return group;
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
    background: InteractiveTokenGroup<Paint>,
): InteractiveTokenGroup<Paint> {
    const foregroundBaseName = foregroundRecipe.name.replace(".recipe", "");
    const setName = `${foregroundBaseName}.on.${background.name.replace("color.", "")}`;

    const set = createTokenNonCss<InteractivePaintSet>(`${setName}.value`, DesignTokenType.color).withDefault(
        (resolve: DesignTokenResolver) =>
            {
                const backgroundSet: InteractivePaintSet = {
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
    ): TypedCSSDesignToken<Paint> {
        return createTokenPaint(`${setName}.${state}`).withDefault(
            (resolve: DesignTokenResolver) =>
                resolve(set)[state] as any
        );
    }

    const group = {
        name: setName,
        intendedFor: foregroundRecipe.intendedFor,
        type: DesignTokenType.color,
        rest: createState(InteractiveState.rest),
        hover: createState(InteractiveState.hover),
        active: createState(InteractiveState.active),
        focus: createState(InteractiveState.focus),
        disabled: createState(InteractiveState.disabled),
    };
    DesignTokenRegistry.Groups.set(setName, group);
    return group;
}
