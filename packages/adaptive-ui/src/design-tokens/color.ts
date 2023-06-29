import type { DesignToken, DesignTokenResolver, ValuesOf } from "@microsoft/fast-foundation";
import {
    ColorRecipe,
    ColorRecipeEvaluate,
    ColorRecipePaletteParams,
    ColorRecipeParams,
    InteractiveColorRecipe,
    InteractiveColorRecipeBySet,
    InteractiveColorRecipePalette,
    InteractiveColorRecipePaletteEvaluate,
    InteractiveSwatchSet,
} from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../color/recipes/black-or-white-by-contrast.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { deltaSwatch } from "../color/recipes/delta-swatch.js";
import { Palette } from "../color/palette.js";
import { Swatch } from "../color/swatch.js";
import { _white } from "../color/utilities/color-constants.js";
import { conditionalSwatchSet } from "../color/utilities/conditional.js";
import { interactiveSwatchSetAsOverlay, swatchAsOverlay } from "../color/utilities/opacity.js";
import { StyleProperty, stylePropertyBorderFillAll } from "../modules/types.js";
import type { InteractiveTokenGroup } from "../types.js";
import { TypedCSSDesignToken } from "../adaptive-design-tokens.js";
import { Recipe, RecipeOptional } from "../recipes.js";
import { createNonCss, createTokenSwatch } from "../token-helpers.js";
import { accentPalette, neutralPalette } from "./palette.js";

function createTokenDelta(name: string, state: keyof InteractiveSwatchSet, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-${state}-delta`).withDefault(value);
}

function createTokenMinContrast(name: string, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-min-contrast`).withDefault(value);
}

function createTokenColorRecipe<T = Swatch>(
    name: string,
    evaluate: ColorRecipeEvaluate<T>,
): DesignToken<ColorRecipe<T>> {
    return createNonCss<ColorRecipe<T>>(`${name}-recipe`).withDefault({
        evaluate
    });
}

function createTokenColorRecipeForPalette(
    name: string,
    evaluate: InteractiveColorRecipePaletteEvaluate,
): DesignToken<InteractiveColorRecipePalette> {
    return createNonCss<InteractiveColorRecipePalette>(`${name}-recipe`).withDefault({
        evaluate
    });
}

function createTokenColorRecipeWithPalette<T>(
    recipeToken: DesignToken<Recipe<ColorRecipePaletteParams, T>>,
    paletteToken: DesignToken<Palette>,
): DesignToken<RecipeOptional<ColorRecipeParams, T>> {
    const palettePrefix = paletteToken.name.split("-")[0] + "-"; // TODO: More resilient
    const name = palettePrefix + recipeToken.name;
    return createNonCss<RecipeOptional<ColorRecipeParams, T>>(name).withDefault({
        evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): T => {
            const p = Object.assign({ palette: resolve(paletteToken) }, params);
            return resolve(recipeToken).evaluate(resolve, p)
        }
    });
}

function createTokenColorRecipeAccent<T>(
    recipeToken: DesignToken<Recipe<ColorRecipePaletteParams, T>>,
): DesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createTokenColorRecipeWithPalette(recipeToken, accentPalette);
}

function createTokenColorRecipeNeutral<T extends InteractiveSwatchSet>(
    recipeToken: DesignToken<Recipe<ColorRecipePaletteParams, T>>,
): DesignToken<RecipeOptional<ColorRecipeParams, T>> {
    const paletteToken = neutralPalette;
    const palettePrefix = paletteToken.name.split("-")[0] + "-"; // TODO: More resilient
    const name = palettePrefix + recipeToken.name;
    return createNonCss<RecipeOptional<ColorRecipeParams, T>>(name).withDefault({
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

function createTokenColorSet(
    recipeToken: DesignToken<InteractiveColorRecipe>,
    intendedFor: StyleProperty | StyleProperty[],
): InteractiveTokenGroup<Swatch> {
    const name = recipeToken.name.replace("-recipe", "");
    const valueToken = createNonCss<InteractiveSwatchSet>(`${name}-value`).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
    return {
        name,
        rest: createTokenColorSetState(valueToken, "rest", intendedFor),
        hover: createTokenColorSetState(valueToken, "hover", intendedFor),
        active: createTokenColorSetState(valueToken, "active", intendedFor),
        focus: createTokenColorSetState(valueToken, "focus", intendedFor),
    };
}

function createTokenColorSetState(
    valueToken: DesignToken<InteractiveSwatchSet>,
    state: keyof InteractiveSwatchSet,
    intendedFor: StyleProperty | StyleProperty[],
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${valueToken.name.replace("-recipe-value", "")}-${state}`, intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state]
    );
}

function createTokenColorRecipeValue(
    recipeToken: DesignToken<ColorRecipe<Swatch>>,
    intendedFor: StyleProperty | StyleProperty[],
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${recipeToken.name.replace("-recipe-value", "")}`, intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
}

/**
 * Convenience values for WCAG contrast requirements.
 *
 * @public
 * @deprecated Use `minContrastDiscernible` or `minContrastReadable` tokens instead
 */
export const ContrastTarget = Object.freeze({
    /**
     * Minimum contrast for normal (&lt;= 14pt) text (AA rating).
     */
    NormalText: 4.5,

    /**
     * Minimum contrast for large (&gt; 14pt) text (AA rating).
     */
    LargeText: 3,
} as const);

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
export const minContrastSafety = createNonCss<number>("min-contrast-safety").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 0 : 3
);

/** @public */
export const minContrastSubtle = createNonCss<number>("min-contrast-subtle").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 1.5 : 3
);

/** @public */
export const minContrastDiscernible = createNonCss<number>("min-contrast-discernible").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 3 : 4.5
);

/** @public */
export const minContrastReadable = createNonCss<number>("min-contrast-readable").withDefault(
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
export const blackOrWhiteDiscernibleRecipe = createNonCss<InteractiveColorRecipeBySet>("black-or-white-discernible-recipe").withDefault(
    {
        evaluate: (resolve: DesignTokenResolver, reference: InteractiveSwatchSet): InteractiveSwatchSet =>
            blackOrWhiteByContrastSet(
                reference.rest,
                reference.hover,
                reference.active,
                reference.focus,
                resolve(minContrastDiscernible),
                false
            )
    }
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
export const blackOrWhiteReadableRecipe = createNonCss<InteractiveColorRecipeBySet>("black-or-white-readable-recipe").withDefault(
    {
        evaluate: (resolve: DesignTokenResolver, reference: InteractiveSwatchSet): InteractiveSwatchSet =>
            blackOrWhiteByContrastSet(
                reference.rest,
                reference.hover,
                reference.active,
                reference.focus,
                resolve(minContrastReadable),
                false
            )
    }
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
export const fillStealthRecipe = createTokenColorRecipeForPalette(fillStealthName,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(fillStealthRestDelta),
            resolve(fillStealthHoverDelta),
            resolve(fillStealthActiveDelta),
            resolve(fillStealthFocusDelta)
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
export const fillSubtleRecipe = createTokenColorRecipeForPalette(fillSubtleName,
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
export const fillDiscernibleRecipe = createTokenColorRecipeForPalette(fillDiscernibleName,
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
export const fillReadableRecipe = createTokenColorRecipeForPalette(fillReadableName,
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
export const strokeSafetyRecipe = createTokenColorRecipeForPalette(strokeSafetyName,
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
export const strokeStealthRecipe = createTokenColorRecipeForPalette(strokeStealthName,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(fillColor),
            resolve(minContrastSafety),
            resolve(strokeStealthRestDelta),
            resolve(strokeStealthHoverDelta),
            resolve(strokeStealthActiveDelta),
            resolve(strokeStealthFocusDelta)
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
export const strokeSubtleRecipe = createTokenColorRecipeForPalette(strokeSubtleName,
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
export const strokeDiscernibleRecipe = createTokenColorRecipeForPalette(strokeDiscernibleName,
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
export const strokeReadableRecipe = createTokenColorRecipeForPalette(strokeReadableName,
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
export const strokeStrongRecipe = createTokenColorRecipeForPalette(strokeStrongName,
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
export const accentFillStealth = createTokenColorSet(accentFillStealthRecipe, StyleProperty.backgroundFill);

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
export const accentFillSubtle = createTokenColorSet(accentFillSubtleRecipe, StyleProperty.backgroundFill);

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
export const accentFillDiscernible = createTokenColorSet(accentFillDiscernibleRecipe, StyleProperty.backgroundFill);

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
export const accentFillReadable = createTokenColorSet(accentFillReadableRecipe, StyleProperty.backgroundFill);

/** @public */
export const accentFillReadableRest = accentFillReadable.rest;

/** @public */
export const accentFillReadableHover = accentFillReadable.hover;

/** @public */
export const accentFillReadableActive = accentFillReadable.active;

/** @public */
export const accentFillReadableFocus = accentFillReadable.focus;

// Foreground On Accent Fill Readable (previously just "Foreground On Accent")

const foregroundOnAccentFillReadableName = "foreground-on-accent-fill-readable";

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRecipe = createTokenColorRecipe(foregroundOnAccentFillReadableName,
    (resolve: DesignTokenResolver): InteractiveSwatchSet =>
        blackOrWhiteByContrastSet(
            resolve(accentFillReadableRest),
            resolve(accentFillReadableHover),
            resolve(accentFillReadableActive),
            resolve(accentFillReadableFocus),
            resolve(minContrastReadable),
            false
        )
);

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadable = createTokenColorSet(foregroundOnAccentFillReadableRecipe, StyleProperty.foregroundFill);

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRest = foregroundOnAccentFillReadable.rest;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableHover = foregroundOnAccentFillReadable.hover;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableActive = foregroundOnAccentFillReadable.active;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableFocus = foregroundOnAccentFillReadable.focus;

// Accent Stroke Safety

/** @public */
export const accentStrokeSafetyRecipe = createTokenColorRecipeAccent(strokeSafetyRecipe);

/** @public */
export const accentStrokeSafety = createTokenColorSet(accentStrokeSafetyRecipe, stylePropertyBorderFillAll);

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
export const accentStrokeStealth = createTokenColorSet(accentStrokeStealthRecipe, stylePropertyBorderFillAll);

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
export const accentStrokeSubtle = createTokenColorSet(accentStrokeSubtleRecipe, stylePropertyBorderFillAll);

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
export const accentStrokeDiscernible = createTokenColorSet(accentStrokeDiscernibleRecipe, stylePropertyBorderFillAll);

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
export const accentStrokeReadable = createTokenColorSet(accentStrokeReadableRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const accentStrokeStrong = createTokenColorSet(accentStrokeStrongRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeStrongRest = accentStrokeStrong.rest;

/** @public */
export const accentStrokeStrongHover = accentStrokeStrong.hover;

/** @public */
export const accentStrokeStrongActive = accentStrokeStrong.active;

/** @public */
export const accentStrokeStrongFocus = accentStrokeStrong.focus;

// Neutral Fill Stealth

/** @public */
export const neutralFillStealthRecipe = createTokenColorRecipeNeutral(fillStealthRecipe);

/** @public */
export const neutralFillStealth = createTokenColorSet(neutralFillStealthRecipe, StyleProperty.backgroundFill);

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
export const neutralFillSubtle = createTokenColorSet(neutralFillSubtleRecipe, StyleProperty.backgroundFill);

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
export const neutralFillDiscernible = createTokenColorSet(neutralFillDiscernibleRecipe, StyleProperty.backgroundFill);

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
export const neutralFillReadable = createTokenColorSet(neutralFillReadableRecipe, StyleProperty.backgroundFill);

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
export const neutralStrokeSafety = createTokenColorSet(neutralStrokeSafetyRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeStealth = createTokenColorSet(neutralStrokeStealthRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeSubtle = createTokenColorSet(neutralStrokeSubtleRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeDiscernible = createTokenColorSet(neutralStrokeDiscernibleRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeReadable = createTokenColorSet(neutralStrokeReadableRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const neutralStrokeStrong = createTokenColorSet(neutralStrokeStrongRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const focusStrokeOuterRecipe = createTokenColorRecipe(focusStrokeOuterName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), resolve(minContrastReadable), true)
);

/** @public */
export const focusStrokeOuter = createTokenColorRecipeValue(focusStrokeOuterRecipe, stylePropertyBorderFillAll);

// Focus Stroke Inner

const focusStrokeInnerName = "focus-stroke-inner";

/** @public */
export const focusStrokeInnerRecipe = createTokenColorRecipe(focusStrokeInnerName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), resolve(minContrastReadable), false)
);

/** @public */
export const focusStrokeInner = createTokenColorRecipeValue(focusStrokeInnerRecipe, stylePropertyBorderFillAll);

// Deprecated tokens

const accentFillReadableName = "accent-fill-readable";

/** @public @deprecated Use `fillReadableRestDelta` instead. */
export const accentFillReadableRestDelta = createTokenDelta(accentFillReadableName, "rest", fillReadableRestDelta);

/** @public @deprecated Use `fillReadableHoverDelta` instead. */
export const accentFillReadableHoverDelta = createTokenDelta(accentFillReadableName, "hover", fillReadableHoverDelta);

/** @public @deprecated Use `fillReadableActiveDelta` instead. */
export const accentFillReadableActiveDelta = createTokenDelta(accentFillReadableName, "active", fillReadableActiveDelta);

/** @public @deprecated Use `fillReadableFocusDelta` instead. */
export const accentFillReadableFocusDelta = createTokenDelta(accentFillReadableName, "focus", fillReadableFocusDelta);

const accentStrokeReadableName = "accent-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const accentStrokeReadableRestDelta = createTokenDelta(accentStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const accentStrokeReadableHoverDelta = createTokenDelta(accentStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const accentStrokeReadableActiveDelta = createTokenDelta(accentStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const accentStrokeReadableFocusDelta = createTokenDelta(accentStrokeReadableName, "focus", strokeReadableFocusDelta);

/** @public @deprecated use "Readable" instead */
export const accentFillRestDelta = accentFillReadableRestDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillHoverDelta = accentFillReadableHoverDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillActiveDelta = accentFillReadableActiveDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillFocusDelta = accentFillReadableFocusDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillRecipe = fillReadableRecipe;

/** @public @deprecated use "Readable" instead */
export const accentFillRest = accentFillReadableRest;

/** @public @deprecated use "Readable" instead */
export const accentFillHover = accentFillReadableHover;

/** @public @deprecated use "Readable" instead */
export const accentFillActive = accentFillReadableActive;

/** @public @deprecated use "Readable" instead */
export const accentFillFocus = accentFillReadableFocus;

/** @public @deprecated use "foregroundOnAccentFillReadable" instead */
export const foregroundOnAccentRecipe = foregroundOnAccentFillReadableRecipe;

/** @public @deprecated use "foregroundOnAccentFillReadable" instead */
export const foregroundOnAccentRest = foregroundOnAccentFillReadableRest;

/** @public @deprecated use "foregroundOnAccentFillReadable" instead */
export const foregroundOnAccentHover = foregroundOnAccentFillReadableHover;

/** @public @deprecated use "foregroundOnAccentFillReadable" instead */
export const foregroundOnAccentActive = foregroundOnAccentFillReadableActive;

/** @public @deprecated use "foregroundOnAccentFillReadable" instead */
export const foregroundOnAccentFocus = foregroundOnAccentFillReadableFocus;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundRestDelta = accentStrokeReadableRestDelta;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundHoverDelta = accentStrokeReadableHoverDelta;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundActiveDelta = accentStrokeReadableActiveDelta;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundFocusDelta = accentStrokeReadableFocusDelta;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundRecipe = strokeReadableRecipe;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundRest = accentStrokeReadableRest;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundHover = accentStrokeReadableHover;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundActive = accentStrokeReadableActive;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundFocus = accentStrokeReadableFocus;

const neutralFillStealthName = "neutral-fill-stealth";

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthRestDelta = createTokenDelta(neutralFillStealthName, "rest", fillStealthRestDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthHoverDelta = createTokenDelta(neutralFillStealthName, "hover", fillStealthHoverDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthActiveDelta = createTokenDelta(neutralFillStealthName, "active", fillStealthActiveDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthFocusDelta = createTokenDelta(neutralFillStealthName, "focus", fillStealthFocusDelta);

const neutralFillSubtleName = "neutral-fill-subtle";

/** @public @deprecated Use `fillSubtleRestDelta` instead. */
export const neutralFillSubtleRestDelta = createTokenDelta(neutralFillSubtleName, "rest", fillSubtleRestDelta);

/** @public @deprecated Use `fillSubtleHoverDelta` instead. */
export const neutralFillSubtleHoverDelta = createTokenDelta(neutralFillSubtleName, "hover", fillSubtleHoverDelta);

/** @public @deprecated Use `fillSubtleActiveDelta` instead. */
export const neutralFillSubtleActiveDelta = createTokenDelta(neutralFillSubtleName, "active", fillSubtleActiveDelta);

/** @public @deprecated Use `fillSubtleFocusDelta` instead. */
export const neutralFillSubtleFocusDelta = createTokenDelta(neutralFillSubtleName, "focus", fillSubtleFocusDelta);

const neutralFillDiscernibleName = "neutral-fill-discernible";

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleRestDelta = createTokenDelta(neutralFillDiscernibleName, "rest", fillDiscernibleRestDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleHoverDelta = createTokenDelta(neutralFillDiscernibleName, "rest", fillDiscernibleHoverDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleActiveDelta = createTokenDelta(neutralFillDiscernibleName, "rest", fillDiscernibleActiveDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleFocusDelta = createTokenDelta(neutralFillDiscernibleName, "rest", fillDiscernibleFocusDelta);

const neutralStrokeSubtleName = "neutral-stroke-subtle";

/** @public @deprecated Use `strokeSubtleRestDelta` instead. */
export const neutralStrokeSubtleRestDelta = createTokenDelta(neutralStrokeSubtleName, "rest", strokeSubtleRestDelta);

/** @public @deprecated Use `strokeSubtleHoverDelta` instead. */
export const neutralStrokeSubtleHoverDelta = createTokenDelta(neutralStrokeSubtleName, "hover", strokeSubtleHoverDelta);

/** @public @deprecated Use `strokeSubtleActiveDelta` instead. */
export const neutralStrokeSubtleActiveDelta = createTokenDelta(neutralStrokeSubtleName, "active", strokeSubtleActiveDelta);

/** @public @deprecated Use `strokeSubtleFocusDelta` instead. */
export const neutralStrokeSubtleFocusDelta = createTokenDelta(neutralStrokeSubtleName, "focus", strokeSubtleFocusDelta);

const neutralStrokeDiscernibleName = "neutral-stroke-discernible";

/** @public @deprecated Use `strokeDiscernibleRestDelta` instead. */
export const neutralStrokeDiscernibleRestDelta = createTokenDelta(neutralStrokeDiscernibleName, "rest", strokeDiscernibleRestDelta);

/** @public @deprecated Use `strokeDiscernibleHoverDelta` instead. */
export const neutralStrokeDiscernibleHoverDelta = createTokenDelta(neutralStrokeDiscernibleName, "hover", strokeDiscernibleHoverDelta);

/** @public @deprecated Use `strokeDiscernibleActiveDelta` instead. */
export const neutralStrokeDiscernibleActiveDelta = createTokenDelta(neutralStrokeDiscernibleName, "active", strokeDiscernibleActiveDelta);

/** @public @deprecated Use `strokeDiscernibleFocusDelta` instead. */
export const neutralStrokeDiscernibleFocusDelta = createTokenDelta(neutralStrokeDiscernibleName, "focus", strokeDiscernibleFocusDelta);

const neutralStrokeReadableName = "neutral-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const neutralStrokeReadableRestDelta = createTokenDelta(neutralStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const neutralStrokeReadableHoverDelta = createTokenDelta(neutralStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const neutralStrokeReadableActiveDelta = createTokenDelta(neutralStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const neutralStrokeReadableFocusDelta = createTokenDelta(neutralStrokeReadableName, "focus", strokeReadableFocusDelta);

const neutralStrokeStrongName = "neutral-stroke-strong";

/** @public @deprecated Use `strokeStrongMinContrast` instead. */
export const neutralStrokeStrongMinContrast = createTokenMinContrast(neutralStrokeStrongName, strokeStrongMinContrast);

/** @public @deprecated Use `strokeStrongRestDelta` instead. */
export const neutralStrokeStrongRestDelta = createTokenDelta(neutralStrokeStrongName, "rest", strokeStrongRestDelta);

/** @public @deprecated Use `strokeStrongHoverDelta` instead. */
export const neutralStrokeStrongHoverDelta = createTokenDelta(neutralStrokeStrongName, "hover", strokeStrongHoverDelta);

/** @public @deprecated Use `strokeStrongActiveDelta` instead. */
export const neutralStrokeStrongActiveDelta = createTokenDelta(neutralStrokeStrongName, "active", strokeStrongActiveDelta);

/** @public @deprecated Use `strokeStrongFocusDelta` instead. */
export const neutralStrokeStrongFocusDelta = createTokenDelta(neutralStrokeStrongName, "focus", strokeStrongFocusDelta);

/** @public @deprecated Use "Stroke Readable" instead */
export const neutralForegroundHintRecipe = strokeReadableRecipe;

/** @public @deprecated Use "Stroke Readable" instead */
export const neutralForegroundHint = neutralStrokeReadableRest;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundMinContrast = neutralStrokeStrongMinContrast;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundRestDelta = neutralStrokeStrongRestDelta;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundHoverDelta = neutralStrokeStrongHoverDelta;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundActiveDelta = neutralStrokeStrongActiveDelta;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundFocusDelta = neutralStrokeStrongFocusDelta;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundRecipe = strokeStrongRecipe;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundRest = neutralStrokeStrongRest;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundHover = neutralStrokeStrongHover;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundActive = neutralStrokeStrongActive;

/** @public @deprecated Use "Stroke Strong" instead */
export const neutralForegroundFocus = neutralStrokeStrongFocus;

/** @public @deprecated use "Subtle" instead */
export const neutralFillRestDelta = neutralFillSubtleRestDelta;

/** @public @deprecated use "Subtle" instead */
export const neutralFillHoverDelta = neutralFillSubtleHoverDelta;

/** @public @deprecated use "Subtle" instead */
export const neutralFillActiveDelta = neutralFillSubtleActiveDelta;

/** @public @deprecated use "Subtle" instead */
export const neutralFillFocusDelta = neutralFillSubtleFocusDelta;

/** @public @deprecated use "Subtle" instead */
export const neutralFillRecipe = fillSubtleRecipe;

/** @public @deprecated use "Subtle" instead */
export const neutralFillRest = neutralFillSubtleRest;

/** @public @deprecated use "Subtle" instead */
export const neutralFillHover = neutralFillSubtleHover;

/** @public @deprecated use "Subtle" instead */
export const neutralFillActive = neutralFillSubtleActive;

/** @public @deprecated use "Subtle" instead */
export const neutralFillFocus = neutralFillSubtleFocus;

// Neutral Fill Input (deprecated)

const neutralFillInputName = "neutral-fill-input";

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputRestDelta = createTokenDelta(neutralFillInputName, "rest", -1);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputHoverDelta = createTokenDelta(neutralFillInputName, "hover", 1);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputActiveDelta = createTokenDelta(neutralFillInputName, "active", -2);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputFocusDelta = createTokenDelta(neutralFillInputName, "focus", -2);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputRecipe = createTokenColorRecipe(neutralFillInputName,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams) =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                params?.reference || resolve(fillColor),
                resolve(neutralFillInputRestDelta),
                resolve(neutralFillInputHoverDelta),
                resolve(neutralFillInputActiveDelta),
                resolve(neutralFillInputFocusDelta)
            ),
            params?.reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralFillInput = createTokenColorSet(neutralFillInputRecipe, StyleProperty.backgroundFill);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputRest = neutralFillInput.rest;

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputHover = neutralFillInput.hover;

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputActive = neutralFillInput.active;

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputFocus = neutralFillInput.focus;

// Neutral Fill Secondary (deprecated)

const neutralFillSecondaryName = "neutral-fill-secondary";

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryRestDelta = createTokenDelta(neutralFillSecondaryName, "rest", 3);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryHoverDelta = createTokenDelta(neutralFillSecondaryName, "hover", 2);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryActiveDelta = createTokenDelta(neutralFillSecondaryName, "active", 1);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryFocusDelta = createTokenDelta(neutralFillSecondaryName, "focus", 3);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryRecipe = createTokenColorRecipe(neutralFillSecondaryName,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams) =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                params?.reference || resolve(fillColor),
                resolve(neutralFillSecondaryRestDelta),
                resolve(neutralFillSecondaryHoverDelta),
                resolve(neutralFillSecondaryActiveDelta),
                resolve(neutralFillSecondaryFocusDelta)
            ),
            params?.reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralFillSecondary = createTokenColorSet(neutralFillSecondaryRecipe, StyleProperty.backgroundFill);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryRest = neutralFillSecondary.rest;

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryHover = neutralFillSecondary.hover;

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryActive = neutralFillSecondary.active;

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryFocus = neutralFillSecondary.focus;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongRestDelta = neutralFillDiscernibleRestDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongHoverDelta = neutralFillDiscernibleHoverDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongActiveDelta = neutralFillDiscernibleActiveDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongFocusDelta = neutralFillDiscernibleFocusDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongRecipe = fillDiscernibleRecipe;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongRest = neutralFillDiscernibleRest;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongHover = neutralFillDiscernibleHover;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongActive = neutralFillDiscernibleActive;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongFocus = neutralFillDiscernibleFocus;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeRestDelta = neutralStrokeSubtleRestDelta;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeHoverDelta = neutralStrokeSubtleHoverDelta;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeActiveDelta = neutralStrokeSubtleActiveDelta;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeFocusDelta = neutralStrokeSubtleFocusDelta;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeRecipe = strokeSubtleRecipe;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeRest = neutralStrokeSubtleRest;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeHover = neutralStrokeSubtleHover;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeActive = neutralStrokeSubtleActive;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeFocus = neutralStrokeSubtleFocus;

// Neutral Stroke Divider (deprecated)

const neutralStrokeDividerName = "neutral-stroke-divider";

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeDividerRestDelta = createTokenDelta(neutralStrokeDividerName, "rest", 4);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeDividerRecipe = createTokenColorRecipe(neutralStrokeDividerName,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams): Swatch =>
        swatchAsOverlay(
            deltaSwatch(
                resolve(neutralPalette),
                params?.reference || resolve(fillColor),
                resolve(neutralStrokeDividerRestDelta)
            ),
            params?.reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeDividerRest = createTokenColorRecipeValue(neutralStrokeDividerRecipe, stylePropertyBorderFillAll);

// Neutral Stroke Input (deprecated)

const neutralStrokeInputName = "neutral-stroke-input";

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRestDelta = createTokenDelta(neutralStrokeInputName, "rest", 3);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHoverDelta = createTokenDelta(neutralStrokeInputName, "hover", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActiveDelta = createTokenDelta(neutralStrokeInputName, "active", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocusDelta = createTokenDelta(neutralStrokeInputName, "focus", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRecipe = createTokenColorRecipe(neutralStrokeInputName,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams) =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                params?.reference || resolve(fillColor),
                resolve(neutralStrokeInputRestDelta),
                resolve(neutralStrokeInputHoverDelta),
                resolve(neutralStrokeInputActiveDelta),
                resolve(neutralStrokeInputFocusDelta)
            ),
            params?.reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralStrokeInput = createTokenColorSet(neutralStrokeInputRecipe, stylePropertyBorderFillAll);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRest = neutralStrokeInput.rest;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHover = neutralStrokeInput.hover;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActive = neutralStrokeInput.active;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocus = neutralStrokeInput.focus;
