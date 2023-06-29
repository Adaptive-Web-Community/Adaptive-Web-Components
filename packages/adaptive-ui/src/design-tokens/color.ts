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
import { createNonCss, createTokenSwatch } from "./create.js";
import { accentPalette, neutralPalette } from "./palette.js";

function createDelta(name: string, state: keyof InteractiveSwatchSet, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-${state}-delta`).withDefault(value);
}

function createMinContrast(name: string, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-min-contrast`).withDefault(value);
}

function createRecipe<T = Swatch>(
    name: string,
    evaluate: ColorRecipeEvaluate<T>,
): DesignToken<ColorRecipe<T>> {
    return createNonCss<ColorRecipe<T>>(`${name}-recipe`).withDefault({
        evaluate
    });
}

function createRecipeForPalette(
    name: string,
    evaluate: InteractiveColorRecipePaletteEvaluate,
): DesignToken<InteractiveColorRecipePalette> {
    return createNonCss<InteractiveColorRecipePalette>(`${name}-recipe`).withDefault({
        evaluate
    });
}

function createRecipeWithPalette<T>(
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

function createRecipeAccent<T>(
    recipeToken: DesignToken<Recipe<ColorRecipePaletteParams, T>>,
): DesignToken<RecipeOptional<ColorRecipeParams, T>> {
    return createRecipeWithPalette(recipeToken, accentPalette);
}

function createRecipeNeutral<T extends InteractiveSwatchSet>(
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

function createSet(
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
        rest: createStateToken(valueToken, "rest", intendedFor),
        hover: createStateToken(valueToken, "hover", intendedFor),
        active: createStateToken(valueToken, "active", intendedFor),
        focus: createStateToken(valueToken, "focus", intendedFor),
    };
}

function createStateToken(
    valueToken: DesignToken<InteractiveSwatchSet>,
    state: keyof InteractiveSwatchSet,
    intendedFor: StyleProperty | StyleProperty[],
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${valueToken.name.replace("-recipe-value", "")}-${state}`, intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state]
    );
}

function createRecipeToken(
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
export const fillStealthRestDelta = createDelta(fillStealthName, "rest", 0);

/** @public */
export const fillStealthHoverDelta = createDelta(fillStealthName, "hover", 3);

/** @public */
export const fillStealthActiveDelta = createDelta(fillStealthName, "active", 2);

/** @public */
export const fillStealthFocusDelta = createDelta(fillStealthName, "focus", 0);

const fillSubtleName = "fill-subtle";

/** @public */
export const fillSubtleRestDelta = createDelta(fillSubtleName, "rest", 2);

/** @public */
export const fillSubtleHoverDelta = createDelta(fillSubtleName, "hover", 1);

/** @public */
export const fillSubtleActiveDelta = createDelta(fillSubtleName, "active", 0);

/** @public */
export const fillSubtleFocusDelta = createDelta(fillSubtleName, "focus", 2);

const fillDiscernibleName = "fill-discernible";

/** @public */
export const fillDiscernibleRestDelta = createDelta(fillDiscernibleName, "rest", 0);

/** @public */
export const fillDiscernibleHoverDelta = createDelta(fillDiscernibleName, "hover", 8);

/** @public */
export const fillDiscernibleActiveDelta = createDelta(fillDiscernibleName, "active", -5);

/** @public */
export const fillDiscernibleFocusDelta = createDelta(fillDiscernibleName, "focus", 0);

const fillReadableName = "fill-readable";

/** @public */
export const fillReadableRestDelta = createDelta(fillReadableName, "rest", 0);

/** @public */
export const fillReadableHoverDelta = createDelta(fillReadableName, "hover", -2);

/** @public */
export const fillReadableActiveDelta = createDelta(fillReadableName, "active", -5);

/** @public */
export const fillReadableFocusDelta = createDelta(fillReadableName, "focus", 0);

const strokeSafetyName = "stroke-safety";

/** @public */
export const strokeSafetyRestDelta = createDelta(strokeSafetyName, "rest", 0);

/** @public */
export const strokeSafetyHoverDelta = createDelta(strokeSafetyName, "hover", 6);

/** @public */
export const strokeSafetyActiveDelta = createDelta(strokeSafetyName, "active", -6);

/** @public */
export const strokeSafetyFocusDelta = createDelta(strokeSafetyName, "focus", 0);

const strokeStealthName = "stroke-stealth";

/** @public */
export const strokeStealthRestDelta = createDelta(strokeStealthName, "rest", 0);

/** @public */
export const strokeStealthHoverDelta = createDelta(strokeStealthName, "hover", 6);

/** @public */
export const strokeStealthActiveDelta = createDelta(strokeStealthName, "active", -6);

/** @public */
export const strokeStealthFocusDelta = createDelta(strokeStealthName, "focus", 0);

const strokeSubtleName = "stroke-subtle";

/** @public */
export const strokeSubtleRestDelta = createDelta(strokeSubtleName, "rest", 0);

/** @public */
export const strokeSubtleHoverDelta = createDelta(strokeSubtleName, "hover", 4);

/** @public */
export const strokeSubtleActiveDelta = createDelta(strokeSubtleName, "active", -2);

/** @public */
export const strokeSubtleFocusDelta = createDelta(strokeSubtleName, "focus", 0);

const strokeDiscernibleName = "stroke-discernible";

/** @public */
export const strokeDiscernibleRestDelta = createDelta(strokeDiscernibleName, "rest", 0);

/** @public */
export const strokeDiscernibleHoverDelta = createDelta(strokeDiscernibleName, "hover", 8);

/** @public */
export const strokeDiscernibleActiveDelta = createDelta(strokeDiscernibleName, "active", -4);

/** @public */
export const strokeDiscernibleFocusDelta = createDelta(strokeDiscernibleName, "focus", 0);

const strokeReadableName = "stroke-readable";

/** @public */
export const strokeReadableRestDelta = createDelta(strokeReadableName, "rest", 0);

/** @public */
export const strokeReadableHoverDelta = createDelta(strokeReadableName, "hover", 6);

/** @public */
export const strokeReadableActiveDelta = createDelta(strokeReadableName, "active", -6);

/** @public */
export const strokeReadableFocusDelta = createDelta(strokeReadableName, "focus", 0);

const strokeStrongName = "stroke-strong";

/** @public */
export const strokeStrongMinContrast = createMinContrast(strokeStrongName, 12);

/** @public */
export const strokeStrongRestDelta = createDelta(strokeStrongName, "rest", 0);

/** @public */
export const strokeStrongHoverDelta = createDelta(strokeStrongName, "hover", 10);

/** @public */
export const strokeStrongActiveDelta = createDelta(strokeStrongName, "active", -10);

/** @public */
export const strokeStrongFocusDelta = createDelta(strokeStrongName, "focus", 0);

// Accent Fill Stealth

/** @public */
export const fillStealthRecipe = createRecipeForPalette(fillStealthName,
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

/** @public */
export const accentFillStealthRecipe = createRecipeAccent(fillStealthRecipe);

/** @public */
export const accentFillStealth = createSet(accentFillStealthRecipe, StyleProperty.backgroundFill);

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
export const fillSubtleRecipe = createRecipeForPalette(fillSubtleName,
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

/** @public */
export const accentFillSubtleRecipe = createRecipeAccent(fillSubtleRecipe);

/** @public */
export const accentFillSubtle = createSet(accentFillSubtleRecipe, StyleProperty.backgroundFill);

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
export const fillDiscernibleRecipe = createRecipeForPalette(fillDiscernibleName,
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

/** @public */
export const accentFillDiscernibleRecipe = createRecipeAccent(fillDiscernibleRecipe);

/** @public */
export const accentFillDiscernible = createSet(accentFillDiscernibleRecipe, StyleProperty.backgroundFill);

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
export const fillReadableRecipe = createRecipeForPalette(fillReadableName,
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

/** @public */
export const accentFillReadableRecipe = createRecipeAccent(fillReadableRecipe);

/** @public */
export const accentFillReadable = createSet(accentFillReadableRecipe, StyleProperty.backgroundFill);

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
export const foregroundOnAccentFillReadableRecipe = createRecipe(foregroundOnAccentFillReadableName,
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
export const foregroundOnAccentFillReadable = createSet(foregroundOnAccentFillReadableRecipe, StyleProperty.foregroundFill);

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
export const strokeSafetyRecipe = createRecipeForPalette(strokeSafetyName,
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

/** @public */
export const accentStrokeSafetyRecipe = createRecipeAccent(strokeSafetyRecipe);

/** @public */
export const accentStrokeSafety = createSet(accentStrokeSafetyRecipe, stylePropertyBorderFillAll);

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
export const strokeStealthRecipe = createRecipeForPalette(strokeStealthName,
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

/** @public */
export const accentStrokeStealthRecipe = createRecipeAccent(strokeStealthRecipe);

/** @public */
export const accentStrokeStealth = createSet(accentStrokeStealthRecipe, stylePropertyBorderFillAll);

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
export const strokeSubtleRecipe = createRecipeForPalette(strokeSubtleName,
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

/** @public */
export const accentStrokeSubtleRecipe = createRecipeAccent(strokeSubtleRecipe);

/** @public */
export const accentStrokeSubtle = createSet(accentStrokeSubtleRecipe, stylePropertyBorderFillAll);

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
export const strokeDiscernibleRecipe = createRecipeForPalette(strokeDiscernibleName,
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

/** @public */
export const accentStrokeDiscernibleRecipe = createRecipeAccent(strokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernible = createSet(accentStrokeDiscernibleRecipe, stylePropertyBorderFillAll);

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
export const strokeReadableRecipe = createRecipeForPalette(strokeReadableName,
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

/** @public */
export const accentStrokeReadableRecipe = createRecipeAccent(strokeReadableRecipe);

/** @public */
export const accentStrokeReadable = createSet(accentStrokeReadableRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const strokeStrongRecipe = createRecipeForPalette(strokeStrongName,
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

/** @public */
export const accentStrokeStrongRecipe = createRecipeAccent(strokeStrongRecipe);

/** @public */
export const accentStrokeStrong = createSet(accentStrokeStrongRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const neutralFillStealthRecipe = createRecipeNeutral(fillStealthRecipe);

/** @public */
export const neutralFillStealth = createSet(neutralFillStealthRecipe, StyleProperty.backgroundFill);

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
export const neutralFillSubtleRecipe = createRecipeNeutral(fillSubtleRecipe);

/** @public */
export const neutralFillSubtle = createSet(neutralFillSubtleRecipe, StyleProperty.backgroundFill);

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
export const neutralFillDiscernibleRecipe = createRecipeNeutral(fillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernible = createSet(neutralFillDiscernibleRecipe, StyleProperty.backgroundFill);

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
export const neutralFillReadableRecipe = createRecipeNeutral(fillReadableRecipe);

/** @public */
export const neutralFillReadable = createSet(neutralFillReadableRecipe, StyleProperty.backgroundFill);

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
export const neutralStrokeSafetyRecipe = createRecipeNeutral(strokeSafetyRecipe);

/** @public */
export const neutralStrokeSafety = createSet(neutralStrokeSafetyRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeStealthRecipe = createRecipeNeutral(strokeStealthRecipe);

/** @public */
export const neutralStrokeStealth = createSet(neutralStrokeStealthRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeSubtleRecipe = createRecipeNeutral(strokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtle = createSet(neutralStrokeSubtleRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeDiscernibleRecipe = createRecipeNeutral(strokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernible = createSet(neutralStrokeDiscernibleRecipe, stylePropertyBorderFillAll);

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
export const neutralStrokeReadableRecipe = createRecipeNeutral(strokeReadableRecipe);

/** @public */
export const neutralStrokeReadable = createSet(neutralStrokeReadableRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const neutralStrokeStrongRecipe = createRecipeNeutral(strokeStrongRecipe);

/** @public */
export const neutralStrokeStrong = createSet(neutralStrokeStrongRecipe, [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

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
export const focusStrokeOuterRecipe = createRecipe(focusStrokeOuterName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), resolve(minContrastReadable), true)
);

/** @public */
export const focusStrokeOuter = createRecipeToken(focusStrokeOuterRecipe, stylePropertyBorderFillAll);

// Focus Stroke Inner

const focusStrokeInnerName = "focus-stroke-inner";

/** @public */
export const focusStrokeInnerRecipe = createRecipe(focusStrokeInnerName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), resolve(minContrastReadable), false)
);

/** @public */
export const focusStrokeInner = createRecipeToken(focusStrokeInnerRecipe, stylePropertyBorderFillAll);

// Deprecated tokens

const accentFillReadableName = "accent-fill-readable";

/** @public @deprecated Use `fillReadableRestDelta` instead. */
export const accentFillReadableRestDelta = createDelta(accentFillReadableName, "rest", fillReadableRestDelta);

/** @public @deprecated Use `fillReadableHoverDelta` instead. */
export const accentFillReadableHoverDelta = createDelta(accentFillReadableName, "hover", fillReadableHoverDelta);

/** @public @deprecated Use `fillReadableActiveDelta` instead. */
export const accentFillReadableActiveDelta = createDelta(accentFillReadableName, "active", fillReadableActiveDelta);

/** @public @deprecated Use `fillReadableFocusDelta` instead. */
export const accentFillReadableFocusDelta = createDelta(accentFillReadableName, "focus", fillReadableFocusDelta);

const accentStrokeReadableName = "accent-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const accentStrokeReadableRestDelta = createDelta(accentStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const accentStrokeReadableHoverDelta = createDelta(accentStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const accentStrokeReadableActiveDelta = createDelta(accentStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const accentStrokeReadableFocusDelta = createDelta(accentStrokeReadableName, "focus", strokeReadableFocusDelta);

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
export const neutralFillStealthRestDelta = createDelta(neutralFillStealthName, "rest", fillStealthRestDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthHoverDelta = createDelta(neutralFillStealthName, "hover", fillStealthHoverDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthActiveDelta = createDelta(neutralFillStealthName, "active", fillStealthActiveDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthFocusDelta = createDelta(neutralFillStealthName, "focus", fillStealthFocusDelta);

const neutralFillSubtleName = "neutral-fill-subtle";

/** @public @deprecated Use `fillSubtleRestDelta` instead. */
export const neutralFillSubtleRestDelta = createDelta(neutralFillSubtleName, "rest", fillSubtleRestDelta);

/** @public @deprecated Use `fillSubtleHoverDelta` instead. */
export const neutralFillSubtleHoverDelta = createDelta(neutralFillSubtleName, "hover", fillSubtleHoverDelta);

/** @public @deprecated Use `fillSubtleActiveDelta` instead. */
export const neutralFillSubtleActiveDelta = createDelta(neutralFillSubtleName, "active", fillSubtleActiveDelta);

/** @public @deprecated Use `fillSubtleFocusDelta` instead. */
export const neutralFillSubtleFocusDelta = createDelta(neutralFillSubtleName, "focus", fillSubtleFocusDelta);

const neutralFillDiscernibleName = "neutral-fill-discernible";

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleRestDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleRestDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleHoverDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleHoverDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleActiveDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleActiveDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleFocusDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleFocusDelta);

const neutralStrokeSubtleName = "neutral-stroke-subtle";

/** @public @deprecated Use `strokeSubtleRestDelta` instead. */
export const neutralStrokeSubtleRestDelta = createDelta(neutralStrokeSubtleName, "rest", strokeSubtleRestDelta);

/** @public @deprecated Use `strokeSubtleHoverDelta` instead. */
export const neutralStrokeSubtleHoverDelta = createDelta(neutralStrokeSubtleName, "hover", strokeSubtleHoverDelta);

/** @public @deprecated Use `strokeSubtleActiveDelta` instead. */
export const neutralStrokeSubtleActiveDelta = createDelta(neutralStrokeSubtleName, "active", strokeSubtleActiveDelta);

/** @public @deprecated Use `strokeSubtleFocusDelta` instead. */
export const neutralStrokeSubtleFocusDelta = createDelta(neutralStrokeSubtleName, "focus", strokeSubtleFocusDelta);

const neutralStrokeDiscernibleName = "neutral-stroke-discernible";

/** @public @deprecated Use `strokeDiscernibleRestDelta` instead. */
export const neutralStrokeDiscernibleRestDelta = createDelta(neutralStrokeDiscernibleName, "rest", strokeDiscernibleRestDelta);

/** @public @deprecated Use `strokeDiscernibleHoverDelta` instead. */
export const neutralStrokeDiscernibleHoverDelta = createDelta(neutralStrokeDiscernibleName, "hover", strokeDiscernibleHoverDelta);

/** @public @deprecated Use `strokeDiscernibleActiveDelta` instead. */
export const neutralStrokeDiscernibleActiveDelta = createDelta(neutralStrokeDiscernibleName, "active", strokeDiscernibleActiveDelta);

/** @public @deprecated Use `strokeDiscernibleFocusDelta` instead. */
export const neutralStrokeDiscernibleFocusDelta = createDelta(neutralStrokeDiscernibleName, "focus", strokeDiscernibleFocusDelta);

const neutralStrokeReadableName = "neutral-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const neutralStrokeReadableRestDelta = createDelta(neutralStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const neutralStrokeReadableHoverDelta = createDelta(neutralStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const neutralStrokeReadableActiveDelta = createDelta(neutralStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const neutralStrokeReadableFocusDelta = createDelta(neutralStrokeReadableName, "focus", strokeReadableFocusDelta);

const neutralStrokeStrongName = "neutral-stroke-strong";

/** @public @deprecated Use `strokeStrongMinContrast` instead. */
export const neutralStrokeStrongMinContrast = createMinContrast(neutralStrokeStrongName, strokeStrongMinContrast);

/** @public @deprecated Use `strokeStrongRestDelta` instead. */
export const neutralStrokeStrongRestDelta = createDelta(neutralStrokeStrongName, "rest", strokeStrongRestDelta);

/** @public @deprecated Use `strokeStrongHoverDelta` instead. */
export const neutralStrokeStrongHoverDelta = createDelta(neutralStrokeStrongName, "hover", strokeStrongHoverDelta);

/** @public @deprecated Use `strokeStrongActiveDelta` instead. */
export const neutralStrokeStrongActiveDelta = createDelta(neutralStrokeStrongName, "active", strokeStrongActiveDelta);

/** @public @deprecated Use `strokeStrongFocusDelta` instead. */
export const neutralStrokeStrongFocusDelta = createDelta(neutralStrokeStrongName, "focus", strokeStrongFocusDelta);

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
export const neutralFillInputRestDelta = createDelta(neutralFillInputName, "rest", -1);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputHoverDelta = createDelta(neutralFillInputName, "hover", 1);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputActiveDelta = createDelta(neutralFillInputName, "active", -2);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputFocusDelta = createDelta(neutralFillInputName, "focus", -2);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputRecipe = createRecipe(neutralFillInputName,
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
const neutralFillInput = createSet(neutralFillInputRecipe, StyleProperty.backgroundFill);

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
export const neutralFillSecondaryRestDelta = createDelta(neutralFillSecondaryName, "rest", 3);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryHoverDelta = createDelta(neutralFillSecondaryName, "hover", 2);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryActiveDelta = createDelta(neutralFillSecondaryName, "active", 1);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryFocusDelta = createDelta(neutralFillSecondaryName, "focus", 3);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryRecipe = createRecipe(neutralFillSecondaryName,
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
const neutralFillSecondary = createSet(neutralFillSecondaryRecipe, StyleProperty.backgroundFill);

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
export const neutralStrokeDividerRestDelta = createDelta(neutralStrokeDividerName, "rest", 4);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeDividerRecipe = createRecipe(neutralStrokeDividerName,
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
export const neutralStrokeDividerRest = createRecipeToken(neutralStrokeDividerRecipe, stylePropertyBorderFillAll);

// Neutral Stroke Input (deprecated)

const neutralStrokeInputName = "neutral-stroke-input";

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRestDelta = createDelta(neutralStrokeInputName, "rest", 3);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHoverDelta = createDelta(neutralStrokeInputName, "hover", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActiveDelta = createDelta(neutralStrokeInputName, "active", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocusDelta = createDelta(neutralStrokeInputName, "focus", 5);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRecipe = createRecipe(neutralStrokeInputName,
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
const neutralStrokeInput = createSet(neutralStrokeInputRecipe, stylePropertyBorderFillAll);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRest = neutralStrokeInput.rest;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHover = neutralStrokeInput.hover;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActive = neutralStrokeInput.active;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocus = neutralStrokeInput.focus;
