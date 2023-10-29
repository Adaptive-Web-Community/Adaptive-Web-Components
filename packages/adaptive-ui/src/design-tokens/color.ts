import type { DesignTokenResolver, ValuesOf } from "@microsoft/fast-foundation";
import { ColorRecipePaletteParams, ColorRecipeParams, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../color/recipes/black-or-white-by-contrast.js";
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
import { accentPalette, criticalPalette, disabledPalette, highlightPalette, neutralPalette } from "./palette.js";

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
export const fillStealthRestDelta = createTokenDelta(fillStealthName, "rest", 0);

/** @public */
export const fillStealthHoverDelta = createTokenDelta(fillStealthName, "hover", 3);

/** @public */
export const fillStealthActiveDelta = createTokenDelta(fillStealthName, "active", 2);

/** @public */
export const fillStealthFocusDelta = createTokenDelta(fillStealthName, "focus", 0);

/** @public */
export const fillStealthDisabledDelta = createTokenDelta(fillStealthName, "disabled", 0);

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
export const fillSubtleRestDelta = createTokenDelta(fillSubtleName, "rest", 2);

/** @public */
export const fillSubtleHoverDelta = createTokenDelta(fillSubtleName, "hover", 1);

/** @public */
export const fillSubtleActiveDelta = createTokenDelta(fillSubtleName, "active", 0);

/** @public */
export const fillSubtleFocusDelta = createTokenDelta(fillSubtleName, "focus", 2);

/** @public */
export const fillSubtleDisabledDelta = createTokenDelta(fillSubtleName, "disabled", 2);

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

const fillDiscernibleName = "fill-discernible";

/** @public */
export const fillDiscernibleRestDelta = createTokenDelta(fillDiscernibleName, "rest", 0);

/** @public */
export const fillDiscernibleHoverDelta = createTokenDelta(fillDiscernibleName, "hover", 8);

/** @public */
export const fillDiscernibleActiveDelta = createTokenDelta(fillDiscernibleName, "active", -5);

/** @public */
export const fillDiscernibleFocusDelta = createTokenDelta(fillDiscernibleName, "focus", 0);

/** @public */
export const fillDiscernibleDisabledDelta = createTokenDelta(fillDiscernibleName, "disabled", 2);

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
export const fillReadableRestDelta = createTokenDelta(fillReadableName, "rest", 0);

/** @public */
export const fillReadableHoverDelta = createTokenDelta(fillReadableName, "hover", -2);

/** @public */
export const fillReadableActiveDelta = createTokenDelta(fillReadableName, "active", -5);

/** @public */
export const fillReadableFocusDelta = createTokenDelta(fillReadableName, "focus", 0);

/** @public */
export const fillReadableDisabledDelta = createTokenDelta(fillReadableName, "disabled", 2);

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
export const strokeSafetyRestDelta = createTokenDelta(strokeSafetyName, "rest", 0);

/** @public */
export const strokeSafetyHoverDelta = createTokenDelta(strokeSafetyName, "hover", 6);

/** @public */
export const strokeSafetyActiveDelta = createTokenDelta(strokeSafetyName, "active", -6);

/** @public */
export const strokeSafetyFocusDelta = createTokenDelta(strokeSafetyName, "focus", 0);

/** @public */
export const strokeSafetyDisabledDelta = createTokenDelta(strokeSafetyName, "disabled", 0);

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
export const strokeStealthRestDelta = createTokenDelta(strokeStealthName, "rest", 0);

/** @public */
export const strokeStealthHoverDelta = createTokenDelta(strokeStealthName, "hover", 6);

/** @public */
export const strokeStealthActiveDelta = createTokenDelta(strokeStealthName, "active", -6);

/** @public */
export const strokeStealthFocusDelta = createTokenDelta(strokeStealthName, "focus", 0);

/** @public */
export const strokeStealthDisabledDelta = createTokenDelta(strokeStealthName, "disabled", 0);

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
export const strokeSubtleRestDelta = createTokenDelta(strokeSubtleName, "rest", 0);

/** @public */
export const strokeSubtleHoverDelta = createTokenDelta(strokeSubtleName, "hover", 4);

/** @public */
export const strokeSubtleActiveDelta = createTokenDelta(strokeSubtleName, "active", -2);

/** @public */
export const strokeSubtleFocusDelta = createTokenDelta(strokeSubtleName, "focus", 0);

/** @public */
export const strokeSubtleDisabledDelta = createTokenDelta(strokeSubtleName, "disabled", 8);

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
export const strokeDiscernibleRestDelta = createTokenDelta(strokeDiscernibleName, "rest", 0);

/** @public */
export const strokeDiscernibleHoverDelta = createTokenDelta(strokeDiscernibleName, "hover", 8);

/** @public */
export const strokeDiscernibleActiveDelta = createTokenDelta(strokeDiscernibleName, "active", -4);

/** @public */
export const strokeDiscernibleFocusDelta = createTokenDelta(strokeDiscernibleName, "focus", 0);

/** @public */
export const strokeDiscernibleDisabledDelta = createTokenDelta(strokeDiscernibleName, "disabled", 8);

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
export const strokeReadableRestDelta = createTokenDelta(strokeReadableName, "rest", 0);

/** @public */
export const strokeReadableHoverDelta = createTokenDelta(strokeReadableName, "hover", 6);

/** @public */
export const strokeReadableActiveDelta = createTokenDelta(strokeReadableName, "active", -6);

/** @public */
export const strokeReadableFocusDelta = createTokenDelta(strokeReadableName, "focus", 0);

/** @public */
export const strokeReadableDisabledDelta = createTokenDelta(strokeReadableName, "disabled", 8);

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
export const strokeStrongRestDelta = createTokenDelta(strokeStrongName, "rest", 0);

/** @public */
export const strokeStrongHoverDelta = createTokenDelta(strokeStrongName, "hover", 10);

/** @public */
export const strokeStrongActiveDelta = createTokenDelta(strokeStrongName, "active", -10);

/** @public */
export const strokeStrongFocusDelta = createTokenDelta(strokeStrongName, "focus", 0);

/** @public */
export const strokeStrongDisabledDelta = createTokenDelta(strokeStrongName, "disabled", 8);

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

/** @public */
export const accentFillStealthRest = accentFillStealth.rest;

/** @public */
export const accentFillStealthHover = accentFillStealth.hover;

/** @public */
export const accentFillStealthActive = accentFillStealth.active;

/** @public */
export const accentFillStealthFocus = accentFillStealth.focus;

// Accent Fill Subtle

/** @public */
export const accentFillSubtleRecipe = createTokenColorRecipeAccent(fillSubtleRecipe);

/** @public */
export const accentFillSubtle = createTokenColorSet(accentFillSubtleRecipe);

/** @public */
export const accentFillSubtleRest = accentFillSubtle.rest;

/** @public */
export const accentFillSubtleHover = accentFillSubtle.hover;

/** @public */
export const accentFillSubtleActive = accentFillSubtle.active;

/** @public */
export const accentFillSubtleFocus = accentFillSubtle.focus;

// Accent Fill Discernible

/** @public */
export const accentFillDiscernibleRecipe = createTokenColorRecipeAccent(fillDiscernibleRecipe);

/** @public */
export const accentFillDiscernible = createTokenColorSet(accentFillDiscernibleRecipe);

/** @public */
export const accentFillDiscernibleRest = accentFillDiscernible.rest;

/** @public */
export const accentFillDiscernibleHover = accentFillDiscernible.hover;

/** @public */
export const accentFillDiscernibleActive = accentFillDiscernible.active;

/** @public */
export const accentFillDiscernibleFocus = accentFillDiscernible.focus;

// Accent Fill Readable (previously just "Accent Fill")

/** @public */
export const accentFillReadableRecipe = createTokenColorRecipeAccent(fillReadableRecipe);

/** @public */
export const accentFillReadable = createTokenColorSet(accentFillReadableRecipe);

/** @public */
export const accentFillReadableRest = accentFillReadable.rest;

/** @public */
export const accentFillReadableHover = accentFillReadable.hover;

/** @public */
export const accentFillReadableActive = accentFillReadable.active;

/** @public */
export const accentFillReadableFocus = accentFillReadable.focus;

// Accent Stroke Safety

/** @public */
export const accentStrokeSafetyRecipe = createTokenColorRecipeAccent(strokeSafetyRecipe);

/** @public */
export const accentStrokeSafety = createTokenColorSet(accentStrokeSafetyRecipe);

/** @public */
export const accentStrokeSafetyRest = accentStrokeSafety.rest;

/** @public */
export const accentStrokeSafetyHover = accentStrokeSafety.hover;

/** @public */
export const accentStrokeSafetyActive = accentStrokeSafety.active;

/** @public */
export const accentStrokeSafetyFocus = accentStrokeSafety.focus;

// Accent Stroke Stealth

/** @public */
export const accentStrokeStealthRecipe = createTokenColorRecipeAccent(strokeStealthRecipe);

/** @public */
export const accentStrokeStealth = createTokenColorSet(accentStrokeStealthRecipe);

/** @public */
export const accentStrokeStealthRest = accentStrokeStealth.rest;

/** @public */
export const accentStrokeStealthHover = accentStrokeStealth.hover;

/** @public */
export const accentStrokeStealthActive = accentStrokeStealth.active;

/** @public */
export const accentStrokeStealthFocus = accentStrokeStealth.focus;

// Accent Stroke Subtle

/** @public */
export const accentStrokeSubtleRecipe = createTokenColorRecipeAccent(strokeSubtleRecipe);

/** @public */
export const accentStrokeSubtle = createTokenColorSet(accentStrokeSubtleRecipe);

/** @public */
export const accentStrokeSubtleRest = accentStrokeSubtle.rest;

/** @public */
export const accentStrokeSubtleHover = accentStrokeSubtle.hover;

/** @public */
export const accentStrokeSubtleActive = accentStrokeSubtle.active;

/** @public */
export const accentStrokeSubtleFocus = accentStrokeSubtle.focus;

// Accent Stroke Discernible

/** @public */
export const accentStrokeDiscernibleRecipe = createTokenColorRecipeAccent(strokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernible = createTokenColorSet(accentStrokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernibleRest = accentStrokeDiscernible.rest;

/** @public */
export const accentStrokeDiscernibleHover = accentStrokeDiscernible.hover;

/** @public */
export const accentStrokeDiscernibleActive = accentStrokeDiscernible.active;

/** @public */
export const accentStrokeDiscernibleFocus = accentStrokeDiscernible.focus;

// Accent Stroke Readable (previously "Foreground")

/** @public */
export const accentStrokeReadableRecipe = createTokenColorRecipeAccent(strokeReadableRecipe);

/** @public */
export const accentStrokeReadable = createTokenColorSet(accentStrokeReadableRecipe);

/** @public */
export const accentStrokeReadableRest = accentStrokeReadable.rest;

/** @public */
export const accentStrokeReadableHover = accentStrokeReadable.hover;

/** @public */
export const accentStrokeReadableActive = accentStrokeReadable.active;

/** @public */
export const accentStrokeReadableFocus = accentStrokeReadable.focus;

// Accent Stroke Strong

/** @public */
export const accentStrokeStrongRecipe = createTokenColorRecipeAccent(strokeStrongRecipe);

/** @public */
export const accentStrokeStrong = createTokenColorSet(accentStrokeStrongRecipe);

/** @public */
export const accentStrokeStrongRest = accentStrokeStrong.rest;

/** @public */
export const accentStrokeStrongHover = accentStrokeStrong.hover;

/** @public */
export const accentStrokeStrongActive = accentStrokeStrong.active;

/** @public */
export const accentStrokeStrongFocus = accentStrokeStrong.focus;

// Highlight Fill Stealth

/** @public */
export const highlightFillStealthRecipe = createTokenColorRecipeHighlight(fillStealthRecipe);

/** @public */
export const highlightFillStealth = createTokenColorSet(highlightFillStealthRecipe);

/** @public */
export const highlightFillStealthRest = highlightFillStealth.rest;

/** @public */
export const highlightFillStealthHover = highlightFillStealth.hover;

/** @public */
export const highlightFillStealthActive = highlightFillStealth.active;

/** @public */
export const highlightFillStealthFocus = highlightFillStealth.focus;

// Highlight Fill Subtle

/** @public */
export const highlightFillSubtleRecipe = createTokenColorRecipeHighlight(fillSubtleRecipe);

/** @public */
export const highlightFillSubtle = createTokenColorSet(highlightFillSubtleRecipe);

/** @public */
export const highlightFillSubtleRest = highlightFillSubtle.rest;

/** @public */
export const highlightFillSubtleHover = highlightFillSubtle.hover;

/** @public */
export const highlightFillSubtleActive = highlightFillSubtle.active;

/** @public */
export const highlightFillSubtleFocus = highlightFillSubtle.focus;

// Highlight Fill Discernible

/** @public */
export const highlightFillDiscernibleRecipe = createTokenColorRecipeHighlight(fillDiscernibleRecipe);

/** @public */
export const highlightFillDiscernible = createTokenColorSet(highlightFillDiscernibleRecipe);

/** @public */
export const highlightFillDiscernibleRest = highlightFillDiscernible.rest;

/** @public */
export const highlightFillDiscernibleHover = highlightFillDiscernible.hover;

/** @public */
export const highlightFillDiscernibleActive = highlightFillDiscernible.active;

/** @public */
export const highlightFillDiscernibleFocus = highlightFillDiscernible.focus;

// Highlight Fill Readable

/** @public */
export const highlightFillReadableRecipe = createTokenColorRecipeHighlight(fillReadableRecipe);

/** @public */
export const highlightFillReadable = createTokenColorSet(highlightFillReadableRecipe);

/** @public */
export const highlightFillReadableRest = highlightFillReadable.rest;

/** @public */
export const highlightFillReadableHover = highlightFillReadable.hover;

/** @public */
export const highlightFillReadableActive = highlightFillReadable.active;

/** @public */
export const highlightFillReadableFocus = highlightFillReadable.focus;

// Highlight Stroke Safety

/** @public */
export const highlightStrokeSafetyRecipe = createTokenColorRecipeHighlight(strokeSafetyRecipe);

/** @public */
export const highlightStrokeSafety = createTokenColorSet(highlightStrokeSafetyRecipe);

/** @public */
export const highlightStrokeSafetyRest = highlightStrokeSafety.rest;

/** @public */
export const highlightStrokeSafetyHover = highlightStrokeSafety.hover;

/** @public */
export const highlightStrokeSafetyActive = highlightStrokeSafety.active;

/** @public */
export const highlightStrokeSafetyFocus = highlightStrokeSafety.focus;

// Highlight Stroke Stealth

/** @public */
export const highlightStrokeStealthRecipe = createTokenColorRecipeHighlight(strokeStealthRecipe);

/** @public */
export const highlightStrokeStealth = createTokenColorSet(highlightStrokeStealthRecipe);

/** @public */
export const highlightStrokeStealthRest = highlightStrokeStealth.rest;

/** @public */
export const highlightStrokeStealthHover = highlightStrokeStealth.hover;

/** @public */
export const highlightStrokeStealthActive = highlightStrokeStealth.active;

/** @public */
export const highlightStrokeStealthFocus = highlightStrokeStealth.focus;

// Highlight Stroke Subtle

/** @public */
export const highlightStrokeSubtleRecipe = createTokenColorRecipeHighlight(strokeSubtleRecipe);

/** @public */
export const highlightStrokeSubtle = createTokenColorSet(highlightStrokeSubtleRecipe);

/** @public */
export const highlightStrokeSubtleRest = highlightStrokeSubtle.rest;

/** @public */
export const highlightStrokeSubtleHover = highlightStrokeSubtle.hover;

/** @public */
export const highlightStrokeSubtleActive = highlightStrokeSubtle.active;

/** @public */
export const highlightStrokeSubtleFocus = highlightStrokeSubtle.focus;

// Highlight Stroke Discernible

/** @public */
export const highlightStrokeDiscernibleRecipe = createTokenColorRecipeHighlight(strokeDiscernibleRecipe);

/** @public */
export const highlightStrokeDiscernible = createTokenColorSet(highlightStrokeDiscernibleRecipe);

/** @public */
export const highlightStrokeDiscernibleRest = highlightStrokeDiscernible.rest;

/** @public */
export const highlightStrokeDiscernibleHover = highlightStrokeDiscernible.hover;

/** @public */
export const highlightStrokeDiscernibleActive = highlightStrokeDiscernible.active;

/** @public */
export const highlightStrokeDiscernibleFocus = highlightStrokeDiscernible.focus;

// Highlight Stroke Readable

/** @public */
export const highlightStrokeReadableRecipe = createTokenColorRecipeHighlight(strokeReadableRecipe);

/** @public */
export const highlightStrokeReadable = createTokenColorSet(highlightStrokeReadableRecipe);

/** @public */
export const highlightStrokeReadableRest = highlightStrokeReadable.rest;

/** @public */
export const highlightStrokeReadableHover = highlightStrokeReadable.hover;

/** @public */
export const highlightStrokeReadableActive = highlightStrokeReadable.active;

/** @public */
export const highlightStrokeReadableFocus = highlightStrokeReadable.focus;

// Highlight Stroke Strong

/** @public */
export const highlightStrokeStrongRecipe = createTokenColorRecipeHighlight(strokeStrongRecipe);

/** @public */
export const highlightStrokeStrong = createTokenColorSet(highlightStrokeStrongRecipe);

/** @public */
export const highlightStrokeStrongRest = highlightStrokeStrong.rest;

/** @public */
export const highlightStrokeStrongHover = highlightStrokeStrong.hover;

/** @public */
export const highlightStrokeStrongActive = highlightStrokeStrong.active;

/** @public */
export const highlightStrokeStrongFocus = highlightStrokeStrong.focus;

// Critical Fill Stealth

/** @public */
export const criticalFillStealthRecipe = createTokenColorRecipeCritical(fillStealthRecipe);

/** @public */
export const criticalFillStealth = createTokenColorSet(criticalFillStealthRecipe);

/** @public */
export const criticalFillStealthRest = criticalFillStealth.rest;

/** @public */
export const criticalFillStealthHover = criticalFillStealth.hover;

/** @public */
export const criticalFillStealthActive = criticalFillStealth.active;

/** @public */
export const criticalFillStealthFocus = criticalFillStealth.focus;

// Critical Fill Subtle

/** @public */
export const criticalFillSubtleRecipe = createTokenColorRecipeCritical(fillSubtleRecipe);

/** @public */
export const criticalFillSubtle = createTokenColorSet(criticalFillSubtleRecipe);

/** @public */
export const criticalFillSubtleRest = criticalFillSubtle.rest;

/** @public */
export const criticalFillSubtleHover = criticalFillSubtle.hover;

/** @public */
export const criticalFillSubtleActive = criticalFillSubtle.active;

/** @public */
export const criticalFillSubtleFocus = criticalFillSubtle.focus;

// Critical Fill Discernible

/** @public */
export const criticalFillDiscernibleRecipe = createTokenColorRecipeCritical(fillDiscernibleRecipe);

/** @public */
export const criticalFillDiscernible = createTokenColorSet(criticalFillDiscernibleRecipe);

/** @public */
export const criticalFillDiscernibleRest = criticalFillDiscernible.rest;

/** @public */
export const criticalFillDiscernibleHover = criticalFillDiscernible.hover;

/** @public */
export const criticalFillDiscernibleActive = criticalFillDiscernible.active;

/** @public */
export const criticalFillDiscernibleFocus = criticalFillDiscernible.focus;

// Critical Fill Readable

/** @public */
export const criticalFillReadableRecipe = createTokenColorRecipeCritical(fillReadableRecipe);

/** @public */
export const criticalFillReadable = createTokenColorSet(criticalFillReadableRecipe);

/** @public */
export const criticalFillReadableRest = criticalFillReadable.rest;

/** @public */
export const criticalFillReadableHover = criticalFillReadable.hover;

/** @public */
export const criticalFillReadableActive = criticalFillReadable.active;

/** @public */
export const criticalFillReadableFocus = criticalFillReadable.focus;

// Critical Stroke Safety

/** @public */
export const criticalStrokeSafetyRecipe = createTokenColorRecipeCritical(strokeSafetyRecipe);

/** @public */
export const criticalStrokeSafety = createTokenColorSet(criticalStrokeSafetyRecipe);

/** @public */
export const criticalStrokeSafetyRest = criticalStrokeSafety.rest;

/** @public */
export const criticalStrokeSafetyHover = criticalStrokeSafety.hover;

/** @public */
export const criticalStrokeSafetyActive = criticalStrokeSafety.active;

/** @public */
export const criticalStrokeSafetyFocus = criticalStrokeSafety.focus;

// Critical Stroke Stealth

/** @public */
export const criticalStrokeStealthRecipe = createTokenColorRecipeCritical(strokeStealthRecipe);

/** @public */
export const criticalStrokeStealth = createTokenColorSet(criticalStrokeStealthRecipe);

/** @public */
export const criticalStrokeStealthRest = criticalStrokeStealth.rest;

/** @public */
export const criticalStrokeStealthHover = criticalStrokeStealth.hover;

/** @public */
export const criticalStrokeStealthActive = criticalStrokeStealth.active;

/** @public */
export const criticalStrokeStealthFocus = criticalStrokeStealth.focus;

// Critical Stroke Subtle

/** @public */
export const criticalStrokeSubtleRecipe = createTokenColorRecipeCritical(strokeSubtleRecipe);

/** @public */
export const criticalStrokeSubtle = createTokenColorSet(criticalStrokeSubtleRecipe);

/** @public */
export const criticalStrokeSubtleRest = criticalStrokeSubtle.rest;

/** @public */
export const criticalStrokeSubtleHover = criticalStrokeSubtle.hover;

/** @public */
export const criticalStrokeSubtleActive = criticalStrokeSubtle.active;

/** @public */
export const criticalStrokeSubtleFocus = criticalStrokeSubtle.focus;

// Critical Stroke Discernible

/** @public */
export const criticalStrokeDiscernibleRecipe = createTokenColorRecipeCritical(strokeDiscernibleRecipe);

/** @public */
export const criticalStrokeDiscernible = createTokenColorSet(criticalStrokeDiscernibleRecipe);

/** @public */
export const criticalStrokeDiscernibleRest = criticalStrokeDiscernible.rest;

/** @public */
export const criticalStrokeDiscernibleHover = criticalStrokeDiscernible.hover;

/** @public */
export const criticalStrokeDiscernibleActive = criticalStrokeDiscernible.active;

/** @public */
export const criticalStrokeDiscernibleFocus = criticalStrokeDiscernible.focus;

// Critical Stroke Readable

/** @public */
export const criticalStrokeReadableRecipe = createTokenColorRecipeCritical(strokeReadableRecipe);

/** @public */
export const criticalStrokeReadable = createTokenColorSet(criticalStrokeReadableRecipe);

/** @public */
export const criticalStrokeReadableRest = criticalStrokeReadable.rest;

/** @public */
export const criticalStrokeReadableHover = criticalStrokeReadable.hover;

/** @public */
export const criticalStrokeReadableActive = criticalStrokeReadable.active;

/** @public */
export const criticalStrokeReadableFocus = criticalStrokeReadable.focus;

// Critical Stroke Strong

/** @public */
export const criticalStrokeStrongRecipe = createTokenColorRecipeCritical(strokeStrongRecipe);

/** @public */
export const criticalStrokeStrong = createTokenColorSet(criticalStrokeStrongRecipe);

/** @public */
export const criticalStrokeStrongRest = criticalStrokeStrong.rest;

/** @public */
export const criticalStrokeStrongHover = criticalStrokeStrong.hover;

/** @public */
export const criticalStrokeStrongActive = criticalStrokeStrong.active;

/** @public */
export const criticalStrokeStrongFocus = criticalStrokeStrong.focus;

// Neutral Fill Stealth

/** @public */
export const neutralFillStealthRecipe = createTokenColorRecipeNeutral(fillStealthRecipe);

/** @public */
export const neutralFillStealth = createTokenColorSet(neutralFillStealthRecipe);

/** @public */
export const neutralFillStealthRest = neutralFillStealth.rest;

/** @public */
export const neutralFillStealthHover = neutralFillStealth.hover;

/** @public */
export const neutralFillStealthActive = neutralFillStealth.active;

/** @public */
export const neutralFillStealthFocus = neutralFillStealth.focus;

// Neutral Fill Subtle (previously just "Neutral Fill")

/** @public */
export const neutralFillSubtleRecipe = createTokenColorRecipeNeutral(fillSubtleRecipe);

/** @public */
export const neutralFillSubtle = createTokenColorSet(neutralFillSubtleRecipe);

/** @public */
export const neutralFillSubtleRest = neutralFillSubtle.rest;

/** @public */
export const neutralFillSubtleHover = neutralFillSubtle.hover;

/** @public */
export const neutralFillSubtleActive = neutralFillSubtle.active;

/** @public */
export const neutralFillSubtleFocus = neutralFillSubtle.focus;

// Neutral Fill Discernible (previously "Strong")

/** @public */
export const neutralFillDiscernibleRecipe = createTokenColorRecipeNeutral(fillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernible = createTokenColorSet(neutralFillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernibleRest = neutralFillDiscernible.rest;

/** @public */
export const neutralFillDiscernibleHover = neutralFillDiscernible.hover;

/** @public */
export const neutralFillDiscernibleActive = neutralFillDiscernible.active;

/** @public */
export const neutralFillDiscernibleFocus = neutralFillDiscernible.focus;

// Neutral Fill Readable

/** @public */
export const neutralFillReadableRecipe = createTokenColorRecipeNeutral(fillReadableRecipe);

/** @public */
export const neutralFillReadable = createTokenColorSet(neutralFillReadableRecipe);

/** @public */
export const neutralFillReadableRest = neutralFillReadable.rest;

/** @public */
export const neutralFillReadableHover = neutralFillReadable.hover;

/** @public */
export const neutralFillReadableActive = neutralFillReadable.active;

/** @public */
export const neutralFillReadableFocus = neutralFillReadable.focus;

// Neutral Stroke Safety

/** @public */
export const neutralStrokeSafetyRecipe = createTokenColorRecipeNeutral(strokeSafetyRecipe);

/** @public */
export const neutralStrokeSafety = createTokenColorSet(neutralStrokeSafetyRecipe);

/** @public */
export const neutralStrokeSafetyRest = neutralStrokeSafety.rest;

/** @public */
export const neutralStrokeSafetyHover = neutralStrokeSafety.hover;

/** @public */
export const neutralStrokeSafetyActive = neutralStrokeSafety.active;

/** @public */
export const neutralStrokeSafetyFocus = neutralStrokeSafety.focus;

// Neutral Stroke Stealth

/** @public */
export const neutralStrokeStealthRecipe = createTokenColorRecipeNeutral(strokeStealthRecipe);

/** @public */
export const neutralStrokeStealth = createTokenColorSet(neutralStrokeStealthRecipe);

/** @public */
export const neutralStrokeStealthRest = neutralStrokeStealth.rest;

/** @public */
export const neutralStrokeStealthHover = neutralStrokeStealth.hover;

/** @public */
export const neutralStrokeStealthActive = neutralStrokeStealth.active;

/** @public */
export const neutralStrokeStealthFocus = neutralStrokeStealth.focus;

// Neutral Stroke Subtle (previously just "Neutral Stroke")

/** @public */
export const neutralStrokeSubtleRecipe = createTokenColorRecipeNeutral(strokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtle = createTokenColorSet(neutralStrokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtleRest = neutralStrokeSubtle.rest;

/** @public */
export const neutralStrokeSubtleHover = neutralStrokeSubtle.hover;

/** @public */
export const neutralStrokeSubtleActive = neutralStrokeSubtle.active;

/** @public */
export const neutralStrokeSubtleFocus = neutralStrokeSubtle.focus;

// Neutral Stroke Discernible (previously "Strong")

/** @public */
export const neutralStrokeDiscernibleRecipe = createTokenColorRecipeNeutral(strokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernible = createTokenColorSet(neutralStrokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernibleRest = neutralStrokeDiscernible.rest;

/** @public */
export const neutralStrokeDiscernibleHover = neutralStrokeDiscernible.hover;

/** @public */
export const neutralStrokeDiscernibleActive = neutralStrokeDiscernible.active;

/** @public */
export const neutralStrokeDiscernibleFocus = neutralStrokeDiscernible.focus;

// Neutral Stroke Readable (previously "Foreground Hint")

/** @public */
export const neutralStrokeReadableRecipe = createTokenColorRecipeNeutral(strokeReadableRecipe);

/** @public */
export const neutralStrokeReadable = createTokenColorSet(neutralStrokeReadableRecipe);

/** @public */
export const neutralStrokeReadableRest = neutralStrokeReadable.rest;

/** @public */
export const neutralStrokeReadableHover = neutralStrokeReadable.hover;

/** @public */
export const neutralStrokeReadableActive = neutralStrokeReadable.active;

/** @public */
export const neutralStrokeReadableFocus = neutralStrokeReadable.focus;

// Neutral Stroke Strong (previously "Foreground")

/** @public */
export const neutralStrokeStrongRecipe = createTokenColorRecipeNeutral(strokeStrongRecipe);

/** @public */
export const neutralStrokeStrong = createTokenColorSet(neutralStrokeStrongRecipe);

/** @public */
export const neutralStrokeStrongRest = neutralStrokeStrong.rest;

/** @public */
export const neutralStrokeStrongHover = neutralStrokeStrong.hover;

/** @public */
export const neutralStrokeStrongActive = neutralStrokeStrong.active;

/** @public */
export const neutralStrokeStrongFocus = neutralStrokeStrong.focus;

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
