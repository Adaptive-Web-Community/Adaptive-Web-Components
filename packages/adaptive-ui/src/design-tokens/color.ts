import type { DesignTokenResolver, ValuesOf } from "@microsoft/fast-foundation";
import { Palette } from "../color/palette.js";
import { ColorRecipePaletteParams, ColorRecipeParams, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../color/recipes/black-or-white-by-contrast.js";
import { contrastSwatch } from "../color/recipes/contrast-swatch.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { Swatch } from "../color/swatch.js";
import { _white } from "../color/utilities/color-constants.js";
import { conditionalSwatchSet } from "../color/utilities/conditional.js";
import { interactiveSwatchSetAsOverlay } from "../color/utilities/opacity.js";
import { StyleProperty, stylePropertyBorderFillAll } from "../modules/types.js";
import { Recipe, RecipeOptional } from "../recipes.js";
import {
    createTokenColorRecipe,
    createTokenColorRecipeBySet,
    createTokenColorRecipeForPalette,
    createTokenColorRecipeValue,
    createTokenColorRecipeWithPalette,
    createTokenColorSet,
    createTokenDelta,
    createTokenMinContrast
} from "../token-helpers-color.js";
import { createNonCss, createTokenNonCss, createTokenSwatch } from "../token-helpers.js";
import { DesignTokenType, TypedDesignToken } from "../adaptive-design-tokens.js";
import { InteractiveState } from "../types.js";
import { accentPalette, criticalPalette, disabledPalette, highlightPalette, infoPalette, neutralPalette, successPalette, warningPalette } from "./palette.js";

/**
 * Creates a DesignToken that can be used for the _accent_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeAccent<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, accentPalette);
}

/**
 * Creates a DesignToken that can be used for the _highlight_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeHighlight<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, highlightPalette);
}

/**
 * Creates a DesignToken that can be used for the _critical_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeCritical<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, criticalPalette);
}

/**
 * Creates a DesignToken that can be used for the _warning_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeWarning<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, warningPalette);
}

/**
 * Creates a DesignToken that can be used for the _success_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeSuccess<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, successPalette);
}

/**
 * Creates a DesignToken that can be used for the _info_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeInfo<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, infoPalette);
}

/**
 * Creates a DesignToken that can be used for the _neutral_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeNeutral<T extends InteractiveSwatchSet>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    const paletteToken = neutralPalette;
    const palettePrefix = paletteToken.name.split("-")[0] + "-"; // TODO: More resilient
    const name = palettePrefix + recipeToken.name;
    return createTokenNonCss<RecipeOptional<ColorRecipeParams, T>>(name, DesignTokenType.recipe, recipeToken.intendedFor).withDefault({
        evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): T => {
            const p = Object.assign({ palette: resolve(paletteToken) }, params);
            return interactiveSwatchSetAsOverlay(
                resolve(recipeToken).evaluate(resolve, p),
                p.reference || resolve(fillColor),
                resolve(neutralAsOverlay)
            ) as T;
        }
    });
}

/**
 * WCAG Contrast Level (AA or AAA)
 * 
 * @public
 */
export const WcagContrastLevel = {
    aa: "aa",
    aaa: "aaa"
} as const;

/** @public */
export type WcagContrastLevel = ValuesOf<typeof WcagContrastLevel>;

/** @public */
export const wcagContrastLevel = createTokenNonCss<WcagContrastLevel>("wcag-contrast-level", DesignTokenType.string).withDefault("aa");

/** @public */
export const minContrastSafety = createTokenNonCss<number>("min-contrast-safety", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 0 : 3
);

/** @public */
export const minContrastSubtle = createTokenNonCss<number>("min-contrast-subtle", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 1.5 : 3
);

/** @public */
export const minContrastDiscernible = createTokenNonCss<number>("min-contrast-discernible", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 3 : 4.5
);

/** @public */
export const minContrastReadable = createTokenNonCss<number>("min-contrast-readable", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 4.5 : 7
);

/** @public */
export const fillColor = createTokenSwatch("fill-color").withDefault(_white);

/** @public */
export const neutralAsOverlay = createNonCss<boolean>("neutral-as-overlay").withDefault(false);

/**
 * This recipe evaluates the {@link blackOrWhiteByContrastSet} for "discernible" accessibility relative to the provided background set.
 *
 * It is not used by itself, but must be composed into a style module with the desired background set.
 * 
 * Useful for non-text controls like checked checkboxes.
 *
 * @public
 */
export const blackOrWhiteDiscernibleRecipe = createTokenColorRecipeBySet<InteractiveSwatchSet>(
    "black-or-white-discernible",
    StyleProperty.foregroundFill,
    (resolve: DesignTokenResolver, reference: InteractiveSwatchSet) =>
        blackOrWhiteByContrastSet(
            reference,
            resolve(minContrastDiscernible),
            false,
        )
);

/**
 * This recipe evaluates the {@link blackOrWhiteByContrastSet} for "readable" accessibility relative to the provided background set.
 *
 * It is not used by itself, but must be composed into a style module with the desired background set.
 * 
 * Useful for text controls like buttons.
 *
 * @public
 */
export const blackOrWhiteReadableRecipe = createTokenColorRecipeBySet<InteractiveSwatchSet>(
    "black-or-white-readable",
    StyleProperty.foregroundFill,
    (resolve: DesignTokenResolver, reference: InteractiveSwatchSet) =>
        blackOrWhiteByContrastSet(
            reference,
            resolve(minContrastReadable),
            false,
        )
);

// Common recipe deltas

const fillStealthName = "fill-stealth";

/** @public */
export const fillStealthRestDelta = createTokenDelta(fillStealthName, InteractiveState.rest, 0);

/** @public */
export const fillStealthHoverDelta = createTokenDelta(fillStealthName, InteractiveState.hover, 3);

/** @public */
export const fillStealthActiveDelta = createTokenDelta(fillStealthName, InteractiveState.active, 2);

/** @public */
export const fillStealthFocusDelta = createTokenDelta(fillStealthName, InteractiveState.focus, 0);

/** @public */
export const fillStealthDisabledDelta = createTokenDelta(fillStealthName, InteractiveState.disabled, 0);

/** @public */
export const fillStealthRecipe = createTokenColorRecipeForPalette(
    fillStealthName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(fillStealthRestDelta),
            resolve(fillStealthHoverDelta),
            resolve(fillStealthActiveDelta),
            resolve(fillStealthFocusDelta),
            resolve(fillStealthDisabledDelta),
            resolve(disabledPalette),
            undefined,
            true,
        )
);

const fillSubtleName = "fill-subtle";

/** @public */
export const fillSubtleRestDelta = createTokenDelta(fillSubtleName, InteractiveState.rest, 2);

/** @public */
export const fillSubtleHoverDelta = createTokenDelta(fillSubtleName, InteractiveState.hover, 3);

/** @public */
export const fillSubtleActiveDelta = createTokenDelta(fillSubtleName, InteractiveState.active, 1);

/** @public */
export const fillSubtleFocusDelta = createTokenDelta(fillSubtleName, InteractiveState.focus, 2);

/** @public */
export const fillSubtleDisabledDelta = createTokenDelta(fillSubtleName, InteractiveState.disabled, 2);

/** @public */
export const fillSubtleRecipe = createTokenColorRecipeForPalette(
    fillSubtleName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(fillSubtleRestDelta),
            resolve(fillSubtleHoverDelta),
            resolve(fillSubtleActiveDelta),
            resolve(fillSubtleFocusDelta),
            resolve(fillSubtleDisabledDelta),
            resolve(disabledPalette),
        )
);

/** @public */
export const fillSubtleInverseRecipe = createTokenColorRecipeForPalette(
    `${fillSubtleName}-inverse`,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(fillSubtleRestDelta) * -1,
            resolve(fillSubtleHoverDelta) * -1,
            resolve(fillSubtleActiveDelta) * -1,
            resolve(fillSubtleFocusDelta) * -1,
            resolve(fillSubtleDisabledDelta) * -1,
            resolve(disabledPalette),
        )
);

const fillDiscernibleName = "fill-discernible";

/** @public */
export const fillDiscernibleRestDelta = createTokenDelta(fillDiscernibleName, InteractiveState.rest, 0);

/** @public */
export const fillDiscernibleHoverDelta = createTokenDelta(fillDiscernibleName, InteractiveState.hover, 6);

/** @public */
export const fillDiscernibleActiveDelta = createTokenDelta(fillDiscernibleName, InteractiveState.active, 3);

/** @public */
export const fillDiscernibleFocusDelta = createTokenDelta(fillDiscernibleName, InteractiveState.focus, 0);

/** @public */
export const fillDiscernibleDisabledDelta = createTokenDelta(fillDiscernibleName, InteractiveState.disabled, 2);

/** @public */
export const fillDiscernibleRecipe = createTokenColorRecipeForPalette(
    fillDiscernibleName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastDiscernible),
            resolve(fillDiscernibleRestDelta),
            resolve(fillDiscernibleHoverDelta),
            resolve(fillDiscernibleActiveDelta),
            resolve(fillDiscernibleFocusDelta),
            resolve(fillDiscernibleDisabledDelta),
            resolve(disabledPalette),
        )
);

const fillReadableName = "fill-readable";

/** @public */
export const fillReadableRestDelta = createTokenDelta(fillReadableName, InteractiveState.rest, 0);

/** @public */
export const fillReadableHoverDelta = createTokenDelta(fillReadableName, InteractiveState.hover, -2);

/** @public */
export const fillReadableActiveDelta = createTokenDelta(fillReadableName, InteractiveState.active, 2);

/** @public */
export const fillReadableFocusDelta = createTokenDelta(fillReadableName, InteractiveState.focus, 0);

/** @public */
export const fillReadableDisabledDelta = createTokenDelta(fillReadableName, InteractiveState.disabled, 2);

/** @public */
export const fillReadableRecipe = createTokenColorRecipeForPalette(
    fillReadableName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastReadable),
            resolve(fillReadableRestDelta),
            resolve(fillReadableHoverDelta),
            resolve(fillReadableActiveDelta),
            resolve(fillReadableFocusDelta),
            resolve(fillReadableDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeSafetyName = "stroke-safety";

/** @public */
export const strokeSafetyRestDelta = createTokenDelta(strokeSafetyName, InteractiveState.rest, 0);

/** @public */
export const strokeSafetyHoverDelta = createTokenDelta(strokeSafetyName, InteractiveState.hover, 6);

/** @public */
export const strokeSafetyActiveDelta = createTokenDelta(strokeSafetyName, InteractiveState.active, -6);

/** @public */
export const strokeSafetyFocusDelta = createTokenDelta(strokeSafetyName, InteractiveState.focus, 0);

/** @public */
export const strokeSafetyDisabledDelta = createTokenDelta(strokeSafetyName, InteractiveState.disabled, 0);

/** @public */
export const strokeSafetyRecipe = createTokenColorRecipeForPalette(
    strokeSafetyName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        conditionalSwatchSet(
            contrastAndDeltaSwatchSet(
                params.palette,
                params.reference || resolve(fillColor),
                resolve(minContrastSafety),
                resolve(strokeSafetyRestDelta),
                resolve(strokeSafetyHoverDelta),
                resolve(strokeSafetyActiveDelta),
                resolve(strokeSafetyFocusDelta),
                resolve(strokeSafetyDisabledDelta),
                resolve(disabledPalette),
            ),
            resolve(minContrastSafety) > 0
        )
);

const strokeStealthName = "stroke-stealth";

/** @public */
export const strokeStealthRestDelta = createTokenDelta(strokeStealthName, InteractiveState.rest, 0);

/** @public */
export const strokeStealthHoverDelta = createTokenDelta(strokeStealthName, InteractiveState.hover, 6);

/** @public */
export const strokeStealthActiveDelta = createTokenDelta(strokeStealthName, InteractiveState.active, -6);

/** @public */
export const strokeStealthFocusDelta = createTokenDelta(strokeStealthName, InteractiveState.focus, 0);

/** @public */
export const strokeStealthDisabledDelta = createTokenDelta(strokeStealthName, InteractiveState.disabled, 0);

/** @public */
export const strokeStealthRecipe = createTokenColorRecipeForPalette(
    strokeStealthName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastSafety),
            resolve(strokeStealthRestDelta),
            resolve(strokeStealthHoverDelta),
            resolve(strokeStealthActiveDelta),
            resolve(strokeStealthFocusDelta),
            resolve(strokeStealthDisabledDelta),
            resolve(disabledPalette),
            undefined,
            true
        )
);

const strokeSubtleName = "stroke-subtle";

/** @public */
export const strokeSubtleRestDelta = createTokenDelta(strokeSubtleName, InteractiveState.rest, 0);

/** @public */
export const strokeSubtleHoverDelta = createTokenDelta(strokeSubtleName, InteractiveState.hover, 4);

/** @public */
export const strokeSubtleActiveDelta = createTokenDelta(strokeSubtleName, InteractiveState.active, -2);

/** @public */
export const strokeSubtleFocusDelta = createTokenDelta(strokeSubtleName, InteractiveState.focus, 0);

/** @public */
export const strokeSubtleDisabledDelta = createTokenDelta(strokeSubtleName, InteractiveState.disabled, 8);

/** @public */
export const strokeSubtleRecipe = createTokenColorRecipeForPalette(
    strokeSubtleName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastSubtle),
            resolve(strokeSubtleRestDelta),
            resolve(strokeSubtleHoverDelta),
            resolve(strokeSubtleActiveDelta),
            resolve(strokeSubtleFocusDelta),
            resolve(strokeSubtleDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeDiscernibleName = "stroke-discernible";

/** @public */
export const strokeDiscernibleRestDelta = createTokenDelta(strokeDiscernibleName, InteractiveState.rest, 0);

/** @public */
export const strokeDiscernibleHoverDelta = createTokenDelta(strokeDiscernibleName, InteractiveState.hover, 8);

/** @public */
export const strokeDiscernibleActiveDelta = createTokenDelta(strokeDiscernibleName, InteractiveState.active, -4);

/** @public */
export const strokeDiscernibleFocusDelta = createTokenDelta(strokeDiscernibleName, InteractiveState.focus, 0);

/** @public */
export const strokeDiscernibleDisabledDelta = createTokenDelta(strokeDiscernibleName, InteractiveState.disabled, 8);

/** @public */
export const strokeDiscernibleRecipe = createTokenColorRecipeForPalette(
    strokeDiscernibleName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastDiscernible),
            resolve(strokeDiscernibleRestDelta),
            resolve(strokeDiscernibleHoverDelta),
            resolve(strokeDiscernibleActiveDelta),
            resolve(strokeDiscernibleFocusDelta),
            resolve(strokeDiscernibleDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeReadableName = "stroke-readable";

/** @public */
export const strokeReadableRestDelta = createTokenDelta(strokeReadableName, InteractiveState.rest, 0);

/** @public */
export const strokeReadableHoverDelta = createTokenDelta(strokeReadableName, InteractiveState.hover, 6);

/** @public */
export const strokeReadableActiveDelta = createTokenDelta(strokeReadableName, InteractiveState.active, -6);

/** @public */
export const strokeReadableFocusDelta = createTokenDelta(strokeReadableName, InteractiveState.focus, 0);

/** @public */
export const strokeReadableDisabledDelta = createTokenDelta(strokeReadableName, InteractiveState.disabled, 8);

/** @public */
export const strokeReadableRecipe = createTokenColorRecipeForPalette(
    strokeReadableName,
    [...stylePropertyBorderFillAll, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastReadable),
            resolve(strokeReadableRestDelta),
            resolve(strokeReadableHoverDelta),
            resolve(strokeReadableActiveDelta),
            resolve(strokeReadableFocusDelta),
            resolve(strokeReadableDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeStrongName = "stroke-strong";

/** @public */
export const strokeStrongMinContrast = createTokenMinContrast(strokeStrongName, 12);

/** @public */
export const strokeStrongRestDelta = createTokenDelta(strokeStrongName, InteractiveState.rest, 0);

/** @public */
export const strokeStrongHoverDelta = createTokenDelta(strokeStrongName, InteractiveState.hover, 10);

/** @public */
export const strokeStrongActiveDelta = createTokenDelta(strokeStrongName, InteractiveState.active, -10);

/** @public */
export const strokeStrongFocusDelta = createTokenDelta(strokeStrongName, InteractiveState.focus, 0);

/** @public */
export const strokeStrongDisabledDelta = createTokenDelta(strokeStrongName, InteractiveState.disabled, 8);

/** @public */
export const strokeStrongRecipe = createTokenColorRecipeForPalette(
    strokeStrongName,
    [...stylePropertyBorderFillAll, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(strokeStrongMinContrast),
            resolve(strokeStrongRestDelta),
            resolve(strokeStrongHoverDelta),
            resolve(strokeStrongActiveDelta),
            resolve(strokeStrongFocusDelta),
            resolve(strokeStrongDisabledDelta),
            resolve(disabledPalette),
        )
);

// Accent Fill Stealth

/** @public */
export const accentFillStealthRecipe = createTokenColorRecipeAccent(fillStealthRecipe);

/** @public */
export const accentFillStealth = createTokenColorSet(accentFillStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillStealthRest = accentFillStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillStealthHover = accentFillStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillStealthActive = accentFillStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillStealthFocus = accentFillStealth.focus;

// Accent Fill Subtle

/** @public */
export const accentFillSubtleRecipe = createTokenColorRecipeAccent(fillSubtleRecipe);

/** @public */
export const accentFillSubtle = createTokenColorSet(accentFillSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillSubtleRest = accentFillSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillSubtleHover = accentFillSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillSubtleActive = accentFillSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillSubtleFocus = accentFillSubtle.focus;

// Accent Fill Subtle Inverse

/** @public */
export const accentFillSubtleInverseRecipe = createTokenColorRecipeAccent(fillSubtleInverseRecipe);

/** @public */
export const accentFillSubtleInverse = createTokenColorSet(accentFillSubtleInverseRecipe);

// Accent Fill Discernible

/** @public */
export const accentFillDiscernibleRecipe = createTokenColorRecipeAccent(fillDiscernibleRecipe);

/** @public */
export const accentFillDiscernible = createTokenColorSet(accentFillDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillDiscernibleRest = accentFillDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillDiscernibleHover = accentFillDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillDiscernibleActive = accentFillDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillDiscernibleFocus = accentFillDiscernible.focus;

// Accent Fill Readable (previously just "Accent Fill")

/** @public */
export const accentFillReadableRecipe = createTokenColorRecipeAccent(fillReadableRecipe);

/** @public */
export const accentFillReadable = createTokenColorSet(accentFillReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillReadableRest = accentFillReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillReadableHover = accentFillReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillReadableActive = accentFillReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentFillReadableFocus = accentFillReadable.focus;

// Accent Stroke Safety

/** @public */
export const accentStrokeSafetyRecipe = createTokenColorRecipeAccent(strokeSafetyRecipe);

/** @public */
export const accentStrokeSafety = createTokenColorSet(accentStrokeSafetyRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSafetyRest = accentStrokeSafety.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSafetyHover = accentStrokeSafety.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSafetyActive = accentStrokeSafety.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSafetyFocus = accentStrokeSafety.focus;

// Accent Stroke Stealth

/** @public */
export const accentStrokeStealthRecipe = createTokenColorRecipeAccent(strokeStealthRecipe);

/** @public */
export const accentStrokeStealth = createTokenColorSet(accentStrokeStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStealthRest = accentStrokeStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStealthHover = accentStrokeStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStealthActive = accentStrokeStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStealthFocus = accentStrokeStealth.focus;

// Accent Stroke Subtle

/** @public */
export const accentStrokeSubtleRecipe = createTokenColorRecipeAccent(strokeSubtleRecipe);

/** @public */
export const accentStrokeSubtle = createTokenColorSet(accentStrokeSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSubtleRest = accentStrokeSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSubtleHover = accentStrokeSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSubtleActive = accentStrokeSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeSubtleFocus = accentStrokeSubtle.focus;

// Accent Stroke Discernible

/** @public */
export const accentStrokeDiscernibleRecipe = createTokenColorRecipeAccent(strokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernible = createTokenColorSet(accentStrokeDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeDiscernibleRest = accentStrokeDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeDiscernibleHover = accentStrokeDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeDiscernibleActive = accentStrokeDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeDiscernibleFocus = accentStrokeDiscernible.focus;

// Accent Stroke Readable (previously "Foreground")

/** @public */
export const accentStrokeReadableRecipe = createTokenColorRecipeAccent(strokeReadableRecipe);

/** @public */
export const accentStrokeReadable = createTokenColorSet(accentStrokeReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeReadableRest = accentStrokeReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeReadableHover = accentStrokeReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeReadableActive = accentStrokeReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeReadableFocus = accentStrokeReadable.focus;

// Accent Stroke Strong

/** @public */
export const accentStrokeStrongRecipe = createTokenColorRecipeAccent(strokeStrongRecipe);

/** @public */
export const accentStrokeStrong = createTokenColorSet(accentStrokeStrongRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStrongRest = accentStrokeStrong.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStrongHover = accentStrokeStrong.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStrongActive = accentStrokeStrong.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const accentStrokeStrongFocus = accentStrokeStrong.focus;

// Highlight Fill Stealth

/** @public */
export const highlightFillStealthRecipe = createTokenColorRecipeHighlight(fillStealthRecipe);

/** @public */
export const highlightFillStealth = createTokenColorSet(highlightFillStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillStealthRest = highlightFillStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillStealthHover = highlightFillStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillStealthActive = highlightFillStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillStealthFocus = highlightFillStealth.focus;

// Highlight Fill Subtle

/** @public */
export const highlightFillSubtleRecipe = createTokenColorRecipeHighlight(fillSubtleRecipe);

/** @public */
export const highlightFillSubtle = createTokenColorSet(highlightFillSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillSubtleRest = highlightFillSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillSubtleHover = highlightFillSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillSubtleActive = highlightFillSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillSubtleFocus = highlightFillSubtle.focus;

// Highlight Fill Subtle Inverse

/** @public */
export const highlightFillSubtleInverseRecipe = createTokenColorRecipeHighlight(fillSubtleInverseRecipe);

/** @public */
export const highlightFillSubtleInverse = createTokenColorSet(highlightFillSubtleInverseRecipe);

// Highlight Fill Discernible

/** @public */
export const highlightFillDiscernibleRecipe = createTokenColorRecipeHighlight(fillDiscernibleRecipe);

/** @public */
export const highlightFillDiscernible = createTokenColorSet(highlightFillDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillDiscernibleRest = highlightFillDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillDiscernibleHover = highlightFillDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillDiscernibleActive = highlightFillDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillDiscernibleFocus = highlightFillDiscernible.focus;

// Highlight Fill Readable

/** @public */
export const highlightFillReadableRecipe = createTokenColorRecipeHighlight(fillReadableRecipe);

/** @public */
export const highlightFillReadable = createTokenColorSet(highlightFillReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillReadableRest = highlightFillReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillReadableHover = highlightFillReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillReadableActive = highlightFillReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightFillReadableFocus = highlightFillReadable.focus;

// Highlight Stroke Safety

/** @public */
export const highlightStrokeSafetyRecipe = createTokenColorRecipeHighlight(strokeSafetyRecipe);

/** @public */
export const highlightStrokeSafety = createTokenColorSet(highlightStrokeSafetyRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSafetyRest = highlightStrokeSafety.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSafetyHover = highlightStrokeSafety.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSafetyActive = highlightStrokeSafety.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSafetyFocus = highlightStrokeSafety.focus;

// Highlight Stroke Stealth

/** @public */
export const highlightStrokeStealthRecipe = createTokenColorRecipeHighlight(strokeStealthRecipe);

/** @public */
export const highlightStrokeStealth = createTokenColorSet(highlightStrokeStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStealthRest = highlightStrokeStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStealthHover = highlightStrokeStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStealthActive = highlightStrokeStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStealthFocus = highlightStrokeStealth.focus;

// Highlight Stroke Subtle

/** @public */
export const highlightStrokeSubtleRecipe = createTokenColorRecipeHighlight(strokeSubtleRecipe);

/** @public */
export const highlightStrokeSubtle = createTokenColorSet(highlightStrokeSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSubtleRest = highlightStrokeSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSubtleHover = highlightStrokeSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSubtleActive = highlightStrokeSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeSubtleFocus = highlightStrokeSubtle.focus;

// Highlight Stroke Discernible

/** @public */
export const highlightStrokeDiscernibleRecipe = createTokenColorRecipeHighlight(strokeDiscernibleRecipe);

/** @public */
export const highlightStrokeDiscernible = createTokenColorSet(highlightStrokeDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeDiscernibleRest = highlightStrokeDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeDiscernibleHover = highlightStrokeDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeDiscernibleActive = highlightStrokeDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeDiscernibleFocus = highlightStrokeDiscernible.focus;

// Highlight Stroke Readable

/** @public */
export const highlightStrokeReadableRecipe = createTokenColorRecipeHighlight(strokeReadableRecipe);

/** @public */
export const highlightStrokeReadable = createTokenColorSet(highlightStrokeReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeReadableRest = highlightStrokeReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeReadableHover = highlightStrokeReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeReadableActive = highlightStrokeReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeReadableFocus = highlightStrokeReadable.focus;

// Highlight Stroke Strong

/** @public */
export const highlightStrokeStrongRecipe = createTokenColorRecipeHighlight(strokeStrongRecipe);

/** @public */
export const highlightStrokeStrong = createTokenColorSet(highlightStrokeStrongRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStrongRest = highlightStrokeStrong.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStrongHover = highlightStrokeStrong.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStrongActive = highlightStrokeStrong.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const highlightStrokeStrongFocus = highlightStrokeStrong.focus;

// Critical Fill Stealth

/** @public */
export const criticalFillStealthRecipe = createTokenColorRecipeCritical(fillStealthRecipe);

/** @public */
export const criticalFillStealth = createTokenColorSet(criticalFillStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillStealthRest = criticalFillStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillStealthHover = criticalFillStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillStealthActive = criticalFillStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillStealthFocus = criticalFillStealth.focus;

// Critical Fill Subtle

/** @public */
export const criticalFillSubtleRecipe = createTokenColorRecipeCritical(fillSubtleRecipe);

/** @public */
export const criticalFillSubtle = createTokenColorSet(criticalFillSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillSubtleRest = criticalFillSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillSubtleHover = criticalFillSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillSubtleActive = criticalFillSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillSubtleFocus = criticalFillSubtle.focus;

// Critical Fill Subtle Inverse

/** @public */
export const criticalFillSubtleInverseRecipe = createTokenColorRecipeCritical(fillSubtleInverseRecipe);

/** @public */
export const criticalFillSubtleInverse = createTokenColorSet(criticalFillSubtleInverseRecipe);

// Critical Fill Discernible

/** @public */
export const criticalFillDiscernibleRecipe = createTokenColorRecipeCritical(fillDiscernibleRecipe);

/** @public */
export const criticalFillDiscernible = createTokenColorSet(criticalFillDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillDiscernibleRest = criticalFillDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillDiscernibleHover = criticalFillDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillDiscernibleActive = criticalFillDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillDiscernibleFocus = criticalFillDiscernible.focus;

// Critical Fill Readable

/** @public */
export const criticalFillReadableRecipe = createTokenColorRecipeCritical(fillReadableRecipe);

/** @public */
export const criticalFillReadable = createTokenColorSet(criticalFillReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillReadableRest = criticalFillReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillReadableHover = criticalFillReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillReadableActive = criticalFillReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalFillReadableFocus = criticalFillReadable.focus;

// Critical Stroke Safety

/** @public */
export const criticalStrokeSafetyRecipe = createTokenColorRecipeCritical(strokeSafetyRecipe);

/** @public */
export const criticalStrokeSafety = createTokenColorSet(criticalStrokeSafetyRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSafetyRest = criticalStrokeSafety.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSafetyHover = criticalStrokeSafety.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSafetyActive = criticalStrokeSafety.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSafetyFocus = criticalStrokeSafety.focus;

// Critical Stroke Stealth

/** @public */
export const criticalStrokeStealthRecipe = createTokenColorRecipeCritical(strokeStealthRecipe);

/** @public */
export const criticalStrokeStealth = createTokenColorSet(criticalStrokeStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStealthRest = criticalStrokeStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStealthHover = criticalStrokeStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStealthActive = criticalStrokeStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStealthFocus = criticalStrokeStealth.focus;

// Critical Stroke Subtle

/** @public */
export const criticalStrokeSubtleRecipe = createTokenColorRecipeCritical(strokeSubtleRecipe);

/** @public */
export const criticalStrokeSubtle = createTokenColorSet(criticalStrokeSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSubtleRest = criticalStrokeSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSubtleHover = criticalStrokeSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSubtleActive = criticalStrokeSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeSubtleFocus = criticalStrokeSubtle.focus;

// Critical Stroke Discernible

/** @public */
export const criticalStrokeDiscernibleRecipe = createTokenColorRecipeCritical(strokeDiscernibleRecipe);

/** @public */
export const criticalStrokeDiscernible = createTokenColorSet(criticalStrokeDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeDiscernibleRest = criticalStrokeDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeDiscernibleHover = criticalStrokeDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeDiscernibleActive = criticalStrokeDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeDiscernibleFocus = criticalStrokeDiscernible.focus;

// Critical Stroke Readable

/** @public */
export const criticalStrokeReadableRecipe = createTokenColorRecipeCritical(strokeReadableRecipe);

/** @public */
export const criticalStrokeReadable = createTokenColorSet(criticalStrokeReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeReadableRest = criticalStrokeReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeReadableHover = criticalStrokeReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeReadableActive = criticalStrokeReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeReadableFocus = criticalStrokeReadable.focus;

// Critical Stroke Strong

/** @public */
export const criticalStrokeStrongRecipe = createTokenColorRecipeCritical(strokeStrongRecipe);

/** @public */
export const criticalStrokeStrong = createTokenColorSet(criticalStrokeStrongRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStrongRest = criticalStrokeStrong.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStrongHover = criticalStrokeStrong.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStrongActive = criticalStrokeStrong.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const criticalStrokeStrongFocus = criticalStrokeStrong.focus;

// Warning color recipes

/** @public */
export const warningFillStealthRecipe = createTokenColorRecipeWarning(fillStealthRecipe);

/** @public */
export const warningFillStealth = createTokenColorSet(warningFillStealthRecipe);

/** @public */
export const warningFillSubtleRecipe = createTokenColorRecipeWarning(fillSubtleRecipe);

/** @public */
export const warningFillSubtle = createTokenColorSet(warningFillSubtleRecipe);

/** @public */
export const warningFillSubtleInverseRecipe = createTokenColorRecipeWarning(fillSubtleInverseRecipe);

/** @public */
export const warningFillSubtleInverse = createTokenColorSet(warningFillSubtleInverseRecipe);

/** @public */
export const warningFillDiscernibleRecipe = createTokenColorRecipeWarning(fillDiscernibleRecipe);

/** @public */
export const warningFillDiscernible = createTokenColorSet(warningFillDiscernibleRecipe);

/** @public */
export const warningFillReadableRecipe = createTokenColorRecipeWarning(fillReadableRecipe);

/** @public */
export const warningFillReadable = createTokenColorSet(warningFillReadableRecipe);

/** @public */
export const warningStrokeSafetyRecipe = createTokenColorRecipeWarning(strokeSafetyRecipe);

/** @public */
export const warningStrokeSafety = createTokenColorSet(warningStrokeSafetyRecipe);

/** @public */
export const warningStrokeStealthRecipe = createTokenColorRecipeWarning(strokeStealthRecipe);

/** @public */
export const warningStrokeStealth = createTokenColorSet(warningStrokeStealthRecipe);

/** @public */
export const warningStrokeSubtleRecipe = createTokenColorRecipeWarning(strokeSubtleRecipe);

/** @public */
export const warningStrokeSubtle = createTokenColorSet(warningStrokeSubtleRecipe);

/** @public */
export const warningStrokeDiscernibleRecipe = createTokenColorRecipeWarning(strokeDiscernibleRecipe);

/** @public */
export const warningStrokeDiscernible = createTokenColorSet(warningStrokeDiscernibleRecipe);

/** @public */
export const warningStrokeReadableRecipe = createTokenColorRecipeWarning(strokeReadableRecipe);

/** @public */
export const warningStrokeReadable = createTokenColorSet(warningStrokeReadableRecipe);

/** @public */
export const warningStrokeStrongRecipe = createTokenColorRecipeWarning(strokeStrongRecipe);

/** @public */
export const warningStrokeStrong = createTokenColorSet(warningStrokeStrongRecipe);

// Success color recipes

/** @public */
export const successFillStealthRecipe = createTokenColorRecipeSuccess(fillStealthRecipe);

/** @public */
export const successFillStealth = createTokenColorSet(successFillStealthRecipe);

/** @public */
export const successFillSubtleRecipe = createTokenColorRecipeSuccess(fillSubtleRecipe);

/** @public */
export const successFillSubtle = createTokenColorSet(successFillSubtleRecipe);

/** @public */
export const successFillSubtleInverseRecipe = createTokenColorRecipeSuccess(fillSubtleInverseRecipe);

/** @public */
export const successFillSubtleInverse = createTokenColorSet(successFillSubtleInverseRecipe);

/** @public */
export const successFillDiscernibleRecipe = createTokenColorRecipeSuccess(fillDiscernibleRecipe);

/** @public */
export const successFillDiscernible = createTokenColorSet(successFillDiscernibleRecipe);

/** @public */
export const successFillReadableRecipe = createTokenColorRecipeSuccess(fillReadableRecipe);

/** @public */
export const successFillReadable = createTokenColorSet(successFillReadableRecipe);

/** @public */
export const successStrokeSafetyRecipe = createTokenColorRecipeSuccess(strokeSafetyRecipe);

/** @public */
export const successStrokeSafety = createTokenColorSet(successStrokeSafetyRecipe);

/** @public */
export const successStrokeStealthRecipe = createTokenColorRecipeSuccess(strokeStealthRecipe);

/** @public */
export const successStrokeStealth = createTokenColorSet(successStrokeStealthRecipe);

/** @public */
export const successStrokeSubtleRecipe = createTokenColorRecipeSuccess(strokeSubtleRecipe);

/** @public */
export const successStrokeSubtle = createTokenColorSet(successStrokeSubtleRecipe);

/** @public */
export const successStrokeDiscernibleRecipe = createTokenColorRecipeSuccess(strokeDiscernibleRecipe);

/** @public */
export const successStrokeDiscernible = createTokenColorSet(successStrokeDiscernibleRecipe);

/** @public */
export const successStrokeReadableRecipe = createTokenColorRecipeSuccess(strokeReadableRecipe);

/** @public */
export const successStrokeReadable = createTokenColorSet(successStrokeReadableRecipe);

/** @public */
export const successStrokeStrongRecipe = createTokenColorRecipeSuccess(strokeStrongRecipe);

/** @public */
export const successStrokeStrong = createTokenColorSet(successStrokeStrongRecipe);

// Info color recipes

/** @public */
export const infoFillStealthRecipe = createTokenColorRecipeInfo(fillStealthRecipe);

/** @public */
export const infoFillStealth = createTokenColorSet(infoFillStealthRecipe);

/** @public */
export const infoFillSubtleRecipe = createTokenColorRecipeInfo(fillSubtleRecipe);

/** @public */
export const infoFillSubtle = createTokenColorSet(infoFillSubtleRecipe);

/** @public */
export const infoFillSubtleInverseRecipe = createTokenColorRecipeInfo(fillSubtleInverseRecipe);

/** @public */
export const infoFillSubtleInverse = createTokenColorSet(infoFillSubtleInverseRecipe);

/** @public */
export const infoFillDiscernibleRecipe = createTokenColorRecipeInfo(fillDiscernibleRecipe);

/** @public */
export const infoFillDiscernible = createTokenColorSet(infoFillDiscernibleRecipe);

/** @public */
export const infoFillReadableRecipe = createTokenColorRecipeInfo(fillReadableRecipe);

/** @public */
export const infoFillReadable = createTokenColorSet(infoFillReadableRecipe);

/** @public */
export const infoStrokeSafetyRecipe = createTokenColorRecipeInfo(strokeSafetyRecipe);

/** @public */
export const infoStrokeSafety = createTokenColorSet(infoStrokeSafetyRecipe);

/** @public */
export const infoStrokeStealthRecipe = createTokenColorRecipeInfo(strokeStealthRecipe);

/** @public */
export const infoStrokeStealth = createTokenColorSet(infoStrokeStealthRecipe);

/** @public */
export const infoStrokeSubtleRecipe = createTokenColorRecipeInfo(strokeSubtleRecipe);

/** @public */
export const infoStrokeSubtle = createTokenColorSet(infoStrokeSubtleRecipe);

/** @public */
export const infoStrokeDiscernibleRecipe = createTokenColorRecipeInfo(strokeDiscernibleRecipe);

/** @public */
export const infoStrokeDiscernible = createTokenColorSet(infoStrokeDiscernibleRecipe);

/** @public */
export const infoStrokeReadableRecipe = createTokenColorRecipeInfo(strokeReadableRecipe);

/** @public */
export const infoStrokeReadable = createTokenColorSet(infoStrokeReadableRecipe);

/** @public */
export const infoStrokeStrongRecipe = createTokenColorRecipeInfo(strokeStrongRecipe);

/** @public */
export const infoStrokeStrong = createTokenColorSet(infoStrokeStrongRecipe);

// Neutral Fill Stealth

/** @public */
export const neutralFillStealthRecipe = createTokenColorRecipeNeutral(fillStealthRecipe);

/** @public */
export const neutralFillStealth = createTokenColorSet(neutralFillStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillStealthRest = neutralFillStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillStealthHover = neutralFillStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillStealthActive = neutralFillStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillStealthFocus = neutralFillStealth.focus;

// Neutral Fill Subtle (previously just "Neutral Fill")

/** @public */
export const neutralFillSubtleRecipe = createTokenColorRecipeNeutral(fillSubtleRecipe);

/** @public */
export const neutralFillSubtle = createTokenColorSet(neutralFillSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillSubtleRest = neutralFillSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillSubtleHover = neutralFillSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillSubtleActive = neutralFillSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillSubtleFocus = neutralFillSubtle.focus;

// Neutral Fill Subtle Inverse

/** @public */
export const neutralFillSubtleInverseRecipe = createTokenColorRecipeNeutral(fillSubtleInverseRecipe);

/** @public */
export const neutralFillSubtleInverse = createTokenColorSet(neutralFillSubtleInverseRecipe);

// Neutral Fill Discernible (previously "Strong")

/** @public */
export const neutralFillDiscernibleRecipe = createTokenColorRecipeNeutral(fillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernible = createTokenColorSet(neutralFillDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillDiscernibleRest = neutralFillDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillDiscernibleHover = neutralFillDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillDiscernibleActive = neutralFillDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillDiscernibleFocus = neutralFillDiscernible.focus;

// Neutral Fill Readable

/** @public */
export const neutralFillReadableRecipe = createTokenColorRecipeNeutral(fillReadableRecipe);

/** @public */
export const neutralFillReadable = createTokenColorSet(neutralFillReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillReadableRest = neutralFillReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillReadableHover = neutralFillReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillReadableActive = neutralFillReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralFillReadableFocus = neutralFillReadable.focus;

// Neutral Stroke Safety

/** @public */
export const neutralStrokeSafetyRecipe = createTokenColorRecipeNeutral(strokeSafetyRecipe);

/** @public */
export const neutralStrokeSafety = createTokenColorSet(neutralStrokeSafetyRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSafetyRest = neutralStrokeSafety.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSafetyHover = neutralStrokeSafety.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSafetyActive = neutralStrokeSafety.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSafetyFocus = neutralStrokeSafety.focus;

// Neutral Stroke Stealth

/** @public */
export const neutralStrokeStealthRecipe = createTokenColorRecipeNeutral(strokeStealthRecipe);

/** @public */
export const neutralStrokeStealth = createTokenColorSet(neutralStrokeStealthRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStealthRest = neutralStrokeStealth.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStealthHover = neutralStrokeStealth.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStealthActive = neutralStrokeStealth.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStealthFocus = neutralStrokeStealth.focus;

// Neutral Stroke Subtle (previously just "Neutral Stroke")

/** @public */
export const neutralStrokeSubtleRecipe = createTokenColorRecipeNeutral(strokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtle = createTokenColorSet(neutralStrokeSubtleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSubtleRest = neutralStrokeSubtle.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSubtleHover = neutralStrokeSubtle.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSubtleActive = neutralStrokeSubtle.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeSubtleFocus = neutralStrokeSubtle.focus;

// Neutral Stroke Discernible (previously "Strong")

/** @public */
export const neutralStrokeDiscernibleRecipe = createTokenColorRecipeNeutral(strokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernible = createTokenColorSet(neutralStrokeDiscernibleRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeDiscernibleRest = neutralStrokeDiscernible.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeDiscernibleHover = neutralStrokeDiscernible.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeDiscernibleActive = neutralStrokeDiscernible.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeDiscernibleFocus = neutralStrokeDiscernible.focus;

// Neutral Stroke Readable (previously "Foreground Hint")

/** @public */
export const neutralStrokeReadableRecipe = createTokenColorRecipeNeutral(strokeReadableRecipe);

/** @public */
export const neutralStrokeReadable = createTokenColorSet(neutralStrokeReadableRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeReadableRest = neutralStrokeReadable.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeReadableHover = neutralStrokeReadable.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeReadableActive = neutralStrokeReadable.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeReadableFocus = neutralStrokeReadable.focus;

// Neutral Stroke Strong (previously "Foreground")

/** @public */
export const neutralStrokeStrongRecipe = createTokenColorRecipeNeutral(strokeStrongRecipe);

/** @public */
export const neutralStrokeStrong = createTokenColorSet(neutralStrokeStrongRecipe);

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStrongRest = neutralStrokeStrong.rest;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStrongHover = neutralStrokeStrong.hover;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStrongActive = neutralStrokeStrong.active;

/** @public @deprecated Use baseColorSet.state format instead */
export const neutralStrokeStrongFocus = neutralStrokeStrong.focus;

/**
 * The {@link Palette} to use for focus stroke recipes.
 *
 * @remarks
 * By default this maps to the {@link accentPalette}.
 * Use a custom palette like `focusStrokePalette.withDefault(PaletteRGB.from("#[HEX_COLOR]"))`.
 *
 * @public
 */
export const focusStrokePalette = createTokenNonCss<Palette>("focus-stroke-palette", DesignTokenType.palette).withDefault(accentPalette);

/**
 * The minimum contrast for the focus stroke recipe.
 *
 * @remarks
 * By default this maps to the {@link minContrastDiscernible}, which by default meets 3:1 contrast recommendation.
 *
 * @public
 */
export const focusStrokeMinContrast = createTokenNonCss<number>("focus-stroke-min-contrast", DesignTokenType.number).withDefault(minContrastDiscernible);

// Focus Stroke

const focusStrokeName = "focus-stroke";

/** @public */
export const focusStrokeRecipe = createTokenColorRecipe(
    focusStrokeName,
    [...stylePropertyBorderFillAll, StyleProperty.outlineColor],
    (resolve: DesignTokenResolver, params?: ColorRecipeParams): Swatch =>
        contrastSwatch(
            resolve(focusStrokePalette),
            params?.reference || resolve(fillColor),
            resolve(focusStrokeMinContrast)
        )
);

/** @public */
export const focusStroke = createTokenColorRecipeValue(focusStrokeRecipe);

// Focus Stroke Outer

const focusStrokeOuterName = "focus-stroke-outer";

/** @public */
export const focusStrokeOuterRecipe = createTokenColorRecipe(
    focusStrokeOuterName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), resolve(minContrastReadable), true)
);

/** @public */
export const focusStrokeOuter = createTokenColorRecipeValue(focusStrokeOuterRecipe);

// Focus Stroke Inner

const focusStrokeInnerName = "focus-stroke-inner";

/** @public */
export const focusStrokeInnerRecipe = createTokenColorRecipe(
    focusStrokeInnerName,
    stylePropertyBorderFillAll,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), resolve(minContrastReadable), false)
);

/** @public */
export const focusStrokeInner = createTokenColorRecipeValue(focusStrokeInnerRecipe);
