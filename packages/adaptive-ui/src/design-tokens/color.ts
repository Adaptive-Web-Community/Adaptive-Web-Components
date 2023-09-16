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
import { accentPalette, destructivePalette, highlightPalette, neutralPalette } from "./palette.js";

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
 * Creates a DesignToken that can be used for the _destructive_ palette configuration of a shared color recipe.
 *
 * @param recipeToken - The color recipe token.
 *
 * @public
 */
export function createTokenColorRecipeDestructive<T>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, destructivePalette);
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
export const wcagContrastLevel = createNonCss<WcagContrastLevel>("wcag-contrast-level").withDefault("aa");

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
            reference.rest,
            reference.hover,
            reference.active,
            reference.focus,
            resolve(minContrastDiscernible),
            false
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
            reference.rest,
            reference.hover,
            reference.active,
            reference.focus,
            resolve(minContrastReadable),
            false
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
            undefined,
            true
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
            resolve(fillSubtleFocusDelta)
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
            resolve(fillDiscernibleFocusDelta)
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
            resolve(fillReadableFocusDelta)
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
                resolve(strokeSafetyFocusDelta)
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
            resolve(strokeSubtleFocusDelta)
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
            resolve(strokeDiscernibleFocusDelta)
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
            resolve(strokeReadableFocusDelta)
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
            resolve(strokeStrongFocusDelta)
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

// Destructive Fill Stealth

/** @public */
export const destructiveFillStealthRecipe = createTokenColorRecipeDestructive(fillStealthRecipe);

/** @public */
export const destructiveFillStealth = createTokenColorSet(destructiveFillStealthRecipe);

/** @public */
export const destructiveFillStealthRest = destructiveFillStealth.rest;

/** @public */
export const destructiveFillStealthHover = destructiveFillStealth.hover;

/** @public */
export const destructiveFillStealthActive = destructiveFillStealth.active;

/** @public */
export const destructiveFillStealthFocus = destructiveFillStealth.focus;

// Destructive Fill Subtle

/** @public */
export const destructiveFillSubtleRecipe = createTokenColorRecipeDestructive(fillSubtleRecipe);

/** @public */
export const destructiveFillSubtle = createTokenColorSet(destructiveFillSubtleRecipe);

/** @public */
export const destructiveFillSubtleRest = destructiveFillSubtle.rest;

/** @public */
export const destructiveFillSubtleHover = destructiveFillSubtle.hover;

/** @public */
export const destructiveFillSubtleActive = destructiveFillSubtle.active;

/** @public */
export const destructiveFillSubtleFocus = destructiveFillSubtle.focus;

// Destructive Fill Discernible

/** @public */
export const destructiveFillDiscernibleRecipe = createTokenColorRecipeDestructive(fillDiscernibleRecipe);

/** @public */
export const destructiveFillDiscernible = createTokenColorSet(destructiveFillDiscernibleRecipe);

/** @public */
export const destructiveFillDiscernibleRest = destructiveFillDiscernible.rest;

/** @public */
export const destructiveFillDiscernibleHover = destructiveFillDiscernible.hover;

/** @public */
export const destructiveFillDiscernibleActive = destructiveFillDiscernible.active;

/** @public */
export const destructiveFillDiscernibleFocus = destructiveFillDiscernible.focus;

// Destructive Fill Readable

/** @public */
export const destructiveFillReadableRecipe = createTokenColorRecipeDestructive(fillReadableRecipe);

/** @public */
export const destructiveFillReadable = createTokenColorSet(destructiveFillReadableRecipe);

/** @public */
export const destructiveFillReadableRest = destructiveFillReadable.rest;

/** @public */
export const destructiveFillReadableHover = destructiveFillReadable.hover;

/** @public */
export const destructiveFillReadableActive = destructiveFillReadable.active;

/** @public */
export const destructiveFillReadableFocus = destructiveFillReadable.focus;

// Destructive Stroke Safety

/** @public */
export const destructiveStrokeSafetyRecipe = createTokenColorRecipeDestructive(strokeSafetyRecipe);

/** @public */
export const destructiveStrokeSafety = createTokenColorSet(destructiveStrokeSafetyRecipe);

/** @public */
export const destructiveStrokeSafetyRest = destructiveStrokeSafety.rest;

/** @public */
export const destructiveStrokeSafetyHover = destructiveStrokeSafety.hover;

/** @public */
export const destructiveStrokeSafetyActive = destructiveStrokeSafety.active;

/** @public */
export const destructiveStrokeSafetyFocus = destructiveStrokeSafety.focus;

// Destructive Stroke Stealth

/** @public */
export const destructiveStrokeStealthRecipe = createTokenColorRecipeDestructive(strokeStealthRecipe);

/** @public */
export const destructiveStrokeStealth = createTokenColorSet(destructiveStrokeStealthRecipe);

/** @public */
export const destructiveStrokeStealthRest = destructiveStrokeStealth.rest;

/** @public */
export const destructiveStrokeStealthHover = destructiveStrokeStealth.hover;

/** @public */
export const destructiveStrokeStealthActive = destructiveStrokeStealth.active;

/** @public */
export const destructiveStrokeStealthFocus = destructiveStrokeStealth.focus;

// Destructive Stroke Subtle

/** @public */
export const destructiveStrokeSubtleRecipe = createTokenColorRecipeDestructive(strokeSubtleRecipe);

/** @public */
export const destructiveStrokeSubtle = createTokenColorSet(destructiveStrokeSubtleRecipe);

/** @public */
export const destructiveStrokeSubtleRest = destructiveStrokeSubtle.rest;

/** @public */
export const destructiveStrokeSubtleHover = destructiveStrokeSubtle.hover;

/** @public */
export const destructiveStrokeSubtleActive = destructiveStrokeSubtle.active;

/** @public */
export const destructiveStrokeSubtleFocus = destructiveStrokeSubtle.focus;

// Destructive Stroke Discernible

/** @public */
export const destructiveStrokeDiscernibleRecipe = createTokenColorRecipeDestructive(strokeDiscernibleRecipe);

/** @public */
export const destructiveStrokeDiscernible = createTokenColorSet(destructiveStrokeDiscernibleRecipe);

/** @public */
export const destructiveStrokeDiscernibleRest = destructiveStrokeDiscernible.rest;

/** @public */
export const destructiveStrokeDiscernibleHover = destructiveStrokeDiscernible.hover;

/** @public */
export const destructiveStrokeDiscernibleActive = destructiveStrokeDiscernible.active;

/** @public */
export const destructiveStrokeDiscernibleFocus = destructiveStrokeDiscernible.focus;

// Destructive Stroke Readable

/** @public */
export const destructiveStrokeReadableRecipe = createTokenColorRecipeDestructive(strokeReadableRecipe);

/** @public */
export const destructiveStrokeReadable = createTokenColorSet(destructiveStrokeReadableRecipe);

/** @public */
export const destructiveStrokeReadableRest = destructiveStrokeReadable.rest;

/** @public */
export const destructiveStrokeReadableHover = destructiveStrokeReadable.hover;

/** @public */
export const destructiveStrokeReadableActive = destructiveStrokeReadable.active;

/** @public */
export const destructiveStrokeReadableFocus = destructiveStrokeReadable.focus;

// Destructive Stroke Strong

/** @public */
export const destructiveStrokeStrongRecipe = createTokenColorRecipeDestructive(strokeStrongRecipe);

/** @public */
export const destructiveStrokeStrong = createTokenColorSet(destructiveStrokeStrongRecipe);

/** @public */
export const destructiveStrokeStrongRest = destructiveStrokeStrong.rest;

/** @public */
export const destructiveStrokeStrongHover = destructiveStrokeStrong.hover;

/** @public */
export const destructiveStrokeStrongActive = destructiveStrokeStrong.active;

/** @public */
export const destructiveStrokeStrongFocus = destructiveStrokeStrong.focus;

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
