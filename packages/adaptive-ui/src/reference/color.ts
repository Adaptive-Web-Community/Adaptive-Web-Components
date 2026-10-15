import type { DesignTokenResolver, ValuesOf } from "@microsoft/fast-foundation";
import { Palette } from "../core/color/palette.js";
import { ColorRecipePaletteParams, ColorRecipeParams, InteractiveColorSet, InteractivePaintSet } from "../core/color/recipe.js";
import { blackOrWhiteByContrastSet } from "../core/color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../core/color/recipes/black-or-white-by-contrast.js";
import { contrastSwatch } from "../core/color/recipes/contrast-swatch.js";
import { contrastAndDeltaSwatchSet } from "../core/color/recipes/contrast-and-delta-swatch-set.js";
import { deltaSwatchSet } from "../core/color/recipes/delta-swatch-set.js";
import { idealColorDeltaSwatchSet } from "../core/color/recipes/ideal-color-delta-swatch-set.js";
import { Color } from "../core/color/color.js";
import { _white } from "../core/color/utilities/color-constants.js";
import { conditionalSwatchSet } from "../core/color/utilities/conditional.js";
import { interactiveSwatchSetAsOverlay } from "../core/color/utilities/opacity.js";
import { StyleProperty, StylePropertyShorthand } from "../core/modules/types.js";
import { Recipe, RecipeOptional } from "../core/recipes.js";
import {
    createTokenColorRecipe,
    createTokenColorRecipeBySet,
    createTokenColorRecipeForPalette,
    createTokenColorRecipeValue,
    createTokenColorRecipeWithPalette,
    createTokenColorSet,
    createTokenDelta,
    createTokenMinContrast,
} from "../core/token-helpers-color.js";
import { createTokenColor, createTokenNonCss } from "../core/token-helpers.js";
import { InteractiveState } from "../core/types.js";
import { DesignTokenType, TypedDesignToken } from "../core/adaptive-design-tokens.js";
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
export function createTokenColorRecipeNeutral<T extends InteractiveColorSet>(
    recipeToken: TypedDesignToken<Recipe<ColorRecipePaletteParams, T>>,
): TypedDesignToken<RecipeOptional<ColorRecipeParams, T>> {
    const paletteToken = neutralPalette;
    const palettePrefix = paletteToken.name.replace(".palette", ""); // TODO: More resilient
    const recipeSuffix = recipeToken.name.replace("color.shared.", "");
    const name = `${palettePrefix}.${recipeSuffix}`;
    return createTokenNonCss<RecipeOptional<ColorRecipeParams, T>>(name, DesignTokenType.recipe, recipeToken.intendedFor).withDefault({
        evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): T => {
            const p = Object.assign({ palette: resolve(paletteToken) }, params);
            return interactiveSwatchSetAsOverlay(
                resolve(recipeToken).evaluate(resolve, p),
                p.reference as Color || resolve(colorContext),
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
export const wcagContrastLevel = createTokenNonCss<WcagContrastLevel>("color.wcagContrast.level", DesignTokenType.string).withDefault("aa");

/** @public */
export const minContrastSafety = createTokenNonCss<number>("color.wcagContrast.minContrast.safety", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 0 : 3
);

/** @public */
export const minContrastSubtle = createTokenNonCss<number>("color.wcagContrast.minContrast.subtle", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 1.5 : 3
);

/** @public */
export const minContrastIdeal = createTokenNonCss<number>("color.wcagContrast.minContrast.ideal", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 2 : 3
);

/** @public */
export const minContrastDiscernible = createTokenNonCss<number>("color.wcagContrast.minContrast.discernible", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 3 : 4.5
);

/** @public */
export const minContrastReadable = createTokenNonCss<number>("color.wcagContrast.minContrast.readable", DesignTokenType.number).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 4.5 : 7
);

/** @public */
export const colorContext = createTokenColor("color.context", [StyleProperty.backgroundFill, StyleProperty.foregroundFill, ...StylePropertyShorthand.borderFill]).withDefault(_white);

/** @public */
export const neutralAsOverlay = createTokenNonCss<boolean>("color.neutral.asOverlay", DesignTokenType.boolean).withDefault(false);

/**
 * This recipe evaluates the {@link blackOrWhiteByContrastSet} for "discernible" accessibility relative to the provided background set.
 *
 * It is not used by itself, but must be composed into a style module with the desired background set.
 * 
 * Useful for non-text controls like checked checkboxes.
 *
 * @public
 */
export const blackOrWhiteDiscernibleRecipe = createTokenColorRecipeBySet<InteractivePaintSet>(
    "color.blackOrWhite.discernible",
    StyleProperty.foregroundFill,
    (resolve: DesignTokenResolver, reference: InteractivePaintSet) =>
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
export const blackOrWhiteReadableRecipe = createTokenColorRecipeBySet<InteractivePaintSet>(
    "color.blackOrWhite.readable",
    StyleProperty.foregroundFill,
    (resolve: DesignTokenResolver, reference: InteractivePaintSet) =>
        blackOrWhiteByContrastSet(
            reference,
            resolve(minContrastReadable),
            false,
        )
);

// Common recipe deltas

const fillStealthName = "color.shared.fill.stealth";

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
            params.reference || resolve(colorContext),
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

const fillSubtleName = "color.shared.fill.subtle";

/** @public */
export const fillSubtleRestDelta = createTokenDelta(fillSubtleName, InteractiveState.rest, 3);

/** @public */
export const fillSubtleHoverDelta = createTokenDelta(fillSubtleName, InteractiveState.hover, 4);

/** @public */
export const fillSubtleActiveDelta = createTokenDelta(fillSubtleName, InteractiveState.active, 2);

/** @public */
export const fillSubtleFocusDelta = createTokenDelta(fillSubtleName, InteractiveState.focus, 3);

/** @public */
export const fillSubtleDisabledDelta = createTokenDelta(fillSubtleName, InteractiveState.disabled, 3);

/** @public */
export const fillSubtleRecipe = createTokenColorRecipeForPalette(
    fillSubtleName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
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
    `${fillSubtleName}Inverse`,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        deltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(fillSubtleRestDelta) * -1,
            resolve(fillSubtleHoverDelta) * -1,
            resolve(fillSubtleActiveDelta) * -1,
            resolve(fillSubtleFocusDelta) * -1,
            resolve(fillSubtleDisabledDelta),
            resolve(disabledPalette),
        )
);

const fillIdealName = "color.shared.fill.ideal";

/** @public */
export const fillIdealRestDelta = createTokenDelta(fillIdealName, InteractiveState.rest, 0);

/** @public */
export const fillIdealHoverDelta = createTokenDelta(fillIdealName, InteractiveState.hover, -2);

/** @public */
export const fillIdealActiveDelta = createTokenDelta(fillIdealName, InteractiveState.active, 2);

/** @public */
export const fillIdealFocusDelta = createTokenDelta(fillIdealName, InteractiveState.focus, 0);

/** @public */
export const fillIdealDisabledDelta = createTokenDelta(fillIdealName, InteractiveState.disabled, 3);

/** @public */
export const fillIdealRecipe = createTokenColorRecipeForPalette(
    fillIdealName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        idealColorDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastIdeal),
            params.palette.source,
            resolve(fillIdealRestDelta),
            resolve(fillIdealHoverDelta),
            resolve(fillIdealActiveDelta),
            resolve(fillIdealFocusDelta),
            resolve(fillIdealDisabledDelta),
            resolve(disabledPalette),
        )
);

const fillDiscernibleName = "color.shared.fill.discernible";

/** @public */
export const fillDiscernibleRestDelta = createTokenDelta(fillDiscernibleName, InteractiveState.rest, 0);

/** @public */
export const fillDiscernibleHoverDelta = createTokenDelta(fillDiscernibleName, InteractiveState.hover, 6);

/** @public */
export const fillDiscernibleActiveDelta = createTokenDelta(fillDiscernibleName, InteractiveState.active, 3);

/** @public */
export const fillDiscernibleFocusDelta = createTokenDelta(fillDiscernibleName, InteractiveState.focus, 0);

/** @public */
export const fillDiscernibleDisabledDelta = createTokenDelta(fillDiscernibleName, InteractiveState.disabled, 3);

/** @public */
export const fillDiscernibleRecipe = createTokenColorRecipeForPalette(
    fillDiscernibleName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        idealColorDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastDiscernible),
            params.palette.source,
            resolve(fillDiscernibleRestDelta),
            resolve(fillDiscernibleHoverDelta),
            resolve(fillDiscernibleActiveDelta),
            resolve(fillDiscernibleFocusDelta),
            resolve(fillDiscernibleDisabledDelta),
            resolve(disabledPalette),
        )
);

const fillReadableName = "color.shared.fill.readable";

/** @public */
export const fillReadableRestDelta = createTokenDelta(fillReadableName, InteractiveState.rest, 0);

/** @public */
export const fillReadableHoverDelta = createTokenDelta(fillReadableName, InteractiveState.hover, -2);

/** @public */
export const fillReadableActiveDelta = createTokenDelta(fillReadableName, InteractiveState.active, 2);

/** @public */
export const fillReadableFocusDelta = createTokenDelta(fillReadableName, InteractiveState.focus, 0);

/** @public */
export const fillReadableDisabledDelta = createTokenDelta(fillReadableName, InteractiveState.disabled, 3);

/** @public */
export const fillReadableRecipe = createTokenColorRecipeForPalette(
    fillReadableName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        idealColorDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastReadable),
            params.palette.source,
            resolve(fillReadableRestDelta),
            resolve(fillReadableHoverDelta),
            resolve(fillReadableActiveDelta),
            resolve(fillReadableFocusDelta),
            resolve(fillReadableDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeSafetyName = "color.shared.stroke.safety";

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
    StylePropertyShorthand.borderFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        conditionalSwatchSet(
            contrastAndDeltaSwatchSet(
                params.palette,
                params.reference || resolve(colorContext),
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

const strokeStealthName = "color.shared.stroke.stealth";

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
    StylePropertyShorthand.borderFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
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

const strokeSubtleName = "color.shared.stroke.subtle";

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
    StylePropertyShorthand.borderFill,
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastSubtle),
            resolve(strokeSubtleRestDelta),
            resolve(strokeSubtleHoverDelta),
            resolve(strokeSubtleActiveDelta),
            resolve(strokeSubtleFocusDelta),
            resolve(strokeSubtleDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeDiscernibleName = "color.shared.stroke.discernible";

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
    [...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastDiscernible),
            resolve(strokeDiscernibleRestDelta),
            resolve(strokeDiscernibleHoverDelta),
            resolve(strokeDiscernibleActiveDelta),
            resolve(strokeDiscernibleFocusDelta),
            resolve(strokeDiscernibleDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeReadableName = "color.shared.stroke.readable";

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
    [...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
            resolve(minContrastReadable),
            resolve(strokeReadableRestDelta),
            resolve(strokeReadableHoverDelta),
            resolve(strokeReadableActiveDelta),
            resolve(strokeReadableFocusDelta),
            resolve(strokeReadableDisabledDelta),
            resolve(disabledPalette),
        )
);

const strokeStrongName = "color.shared.stroke.strong";

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
    [...StylePropertyShorthand.borderFill, StyleProperty.foregroundFill],
    (resolve: DesignTokenResolver, params: ColorRecipePaletteParams) =>
        contrastAndDeltaSwatchSet(
            params.palette,
            params.reference || resolve(colorContext),
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

// Accent Fill Subtle

/** @public */
export const accentFillSubtleRecipe = createTokenColorRecipeAccent(fillSubtleRecipe);

/** @public */
export const accentFillSubtle = createTokenColorSet(accentFillSubtleRecipe);

// Accent Fill Subtle Inverse

/** @public */
export const accentFillSubtleInverseRecipe = createTokenColorRecipeAccent(fillSubtleInverseRecipe);

/** @public */
export const accentFillSubtleInverse = createTokenColorSet(accentFillSubtleInverseRecipe);

// Accent Fill Ideal

/** @public */
export const accentFillIdealRecipe = createTokenColorRecipeAccent(fillIdealRecipe);

/** @public */
export const accentFillIdeal = createTokenColorSet(accentFillIdealRecipe);

// Accent Fill Discernible

/** @public */
export const accentFillDiscernibleRecipe = createTokenColorRecipeAccent(fillDiscernibleRecipe);

/** @public */
export const accentFillDiscernible = createTokenColorSet(accentFillDiscernibleRecipe);

// Accent Fill Readable (previously just "Accent Fill")

/** @public */
export const accentFillReadableRecipe = createTokenColorRecipeAccent(fillReadableRecipe);

/** @public */
export const accentFillReadable = createTokenColorSet(accentFillReadableRecipe);

// Accent Stroke Safety

/** @public */
export const accentStrokeSafetyRecipe = createTokenColorRecipeAccent(strokeSafetyRecipe);

/** @public */
export const accentStrokeSafety = createTokenColorSet(accentStrokeSafetyRecipe);

// Accent Stroke Stealth

/** @public */
export const accentStrokeStealthRecipe = createTokenColorRecipeAccent(strokeStealthRecipe);

/** @public */
export const accentStrokeStealth = createTokenColorSet(accentStrokeStealthRecipe);

// Accent Stroke Subtle

/** @public */
export const accentStrokeSubtleRecipe = createTokenColorRecipeAccent(strokeSubtleRecipe);

/** @public */
export const accentStrokeSubtle = createTokenColorSet(accentStrokeSubtleRecipe);

// Accent Stroke Discernible

/** @public */
export const accentStrokeDiscernibleRecipe = createTokenColorRecipeAccent(strokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernible = createTokenColorSet(accentStrokeDiscernibleRecipe);

// Accent Stroke Readable (previously "Foreground")

/** @public */
export const accentStrokeReadableRecipe = createTokenColorRecipeAccent(strokeReadableRecipe);

/** @public */
export const accentStrokeReadable = createTokenColorSet(accentStrokeReadableRecipe);

// Accent Stroke Strong

/** @public */
export const accentStrokeStrongRecipe = createTokenColorRecipeAccent(strokeStrongRecipe);

/** @public */
export const accentStrokeStrong = createTokenColorSet(accentStrokeStrongRecipe);

// Highlight Fill Stealth

/** @public */
export const highlightFillStealthRecipe = createTokenColorRecipeHighlight(fillStealthRecipe);

/** @public */
export const highlightFillStealth = createTokenColorSet(highlightFillStealthRecipe);

// Highlight Fill Subtle

/** @public */
export const highlightFillSubtleRecipe = createTokenColorRecipeHighlight(fillSubtleRecipe);

/** @public */
export const highlightFillSubtle = createTokenColorSet(highlightFillSubtleRecipe);

// Highlight Fill Subtle Inverse

/** @public */
export const highlightFillSubtleInverseRecipe = createTokenColorRecipeHighlight(fillSubtleInverseRecipe);

/** @public */
export const highlightFillSubtleInverse = createTokenColorSet(highlightFillSubtleInverseRecipe);

// Highlight Fill Ideal

/** @public */
export const highlightFillIdealRecipe = createTokenColorRecipeHighlight(fillIdealRecipe);

/** @public */
export const highlightFillIdeal = createTokenColorSet(highlightFillIdealRecipe);

// Highlight Fill Discernible

/** @public */
export const highlightFillDiscernibleRecipe = createTokenColorRecipeHighlight(fillDiscernibleRecipe);

/** @public */
export const highlightFillDiscernible = createTokenColorSet(highlightFillDiscernibleRecipe);

// Highlight Fill Readable

/** @public */
export const highlightFillReadableRecipe = createTokenColorRecipeHighlight(fillReadableRecipe);

/** @public */
export const highlightFillReadable = createTokenColorSet(highlightFillReadableRecipe);

// Highlight Stroke Safety

/** @public */
export const highlightStrokeSafetyRecipe = createTokenColorRecipeHighlight(strokeSafetyRecipe);

/** @public */
export const highlightStrokeSafety = createTokenColorSet(highlightStrokeSafetyRecipe);

// Highlight Stroke Stealth

/** @public */
export const highlightStrokeStealthRecipe = createTokenColorRecipeHighlight(strokeStealthRecipe);

/** @public */
export const highlightStrokeStealth = createTokenColorSet(highlightStrokeStealthRecipe);

// Highlight Stroke Subtle

/** @public */
export const highlightStrokeSubtleRecipe = createTokenColorRecipeHighlight(strokeSubtleRecipe);

/** @public */
export const highlightStrokeSubtle = createTokenColorSet(highlightStrokeSubtleRecipe);

// Highlight Stroke Discernible

/** @public */
export const highlightStrokeDiscernibleRecipe = createTokenColorRecipeHighlight(strokeDiscernibleRecipe);

/** @public */
export const highlightStrokeDiscernible = createTokenColorSet(highlightStrokeDiscernibleRecipe);

// Highlight Stroke Readable

/** @public */
export const highlightStrokeReadableRecipe = createTokenColorRecipeHighlight(strokeReadableRecipe);

/** @public */
export const highlightStrokeReadable = createTokenColorSet(highlightStrokeReadableRecipe);

// Highlight Stroke Strong

/** @public */
export const highlightStrokeStrongRecipe = createTokenColorRecipeHighlight(strokeStrongRecipe);

/** @public */
export const highlightStrokeStrong = createTokenColorSet(highlightStrokeStrongRecipe);

// Critical Fill Stealth

/** @public */
export const criticalFillStealthRecipe = createTokenColorRecipeCritical(fillStealthRecipe);

/** @public */
export const criticalFillStealth = createTokenColorSet(criticalFillStealthRecipe);

// Critical Fill Subtle

/** @public */
export const criticalFillSubtleRecipe = createTokenColorRecipeCritical(fillSubtleRecipe);

/** @public */
export const criticalFillSubtle = createTokenColorSet(criticalFillSubtleRecipe);

// Critical Fill Subtle Inverse

/** @public */
export const criticalFillSubtleInverseRecipe = createTokenColorRecipeCritical(fillSubtleInverseRecipe);

/** @public */
export const criticalFillSubtleInverse = createTokenColorSet(criticalFillSubtleInverseRecipe);

// Critical Fill Ideal

/** @public */
export const criticalFillIdealRecipe = createTokenColorRecipeCritical(fillIdealRecipe);

/** @public */
export const criticalFillIdeal = createTokenColorSet(criticalFillIdealRecipe);

// Critical Fill Discernible

/** @public */
export const criticalFillDiscernibleRecipe = createTokenColorRecipeCritical(fillDiscernibleRecipe);

/** @public */
export const criticalFillDiscernible = createTokenColorSet(criticalFillDiscernibleRecipe);

// Critical Fill Readable

/** @public */
export const criticalFillReadableRecipe = createTokenColorRecipeCritical(fillReadableRecipe);

/** @public */
export const criticalFillReadable = createTokenColorSet(criticalFillReadableRecipe);

// Critical Stroke Safety

/** @public */
export const criticalStrokeSafetyRecipe = createTokenColorRecipeCritical(strokeSafetyRecipe);

/** @public */
export const criticalStrokeSafety = createTokenColorSet(criticalStrokeSafetyRecipe);

// Critical Stroke Stealth

/** @public */
export const criticalStrokeStealthRecipe = createTokenColorRecipeCritical(strokeStealthRecipe);

/** @public */
export const criticalStrokeStealth = createTokenColorSet(criticalStrokeStealthRecipe);

// Critical Stroke Subtle

/** @public */
export const criticalStrokeSubtleRecipe = createTokenColorRecipeCritical(strokeSubtleRecipe);

/** @public */
export const criticalStrokeSubtle = createTokenColorSet(criticalStrokeSubtleRecipe);

// Critical Stroke Discernible

/** @public */
export const criticalStrokeDiscernibleRecipe = createTokenColorRecipeCritical(strokeDiscernibleRecipe);

/** @public */
export const criticalStrokeDiscernible = createTokenColorSet(criticalStrokeDiscernibleRecipe);

// Critical Stroke Readable

/** @public */
export const criticalStrokeReadableRecipe = createTokenColorRecipeCritical(strokeReadableRecipe);

/** @public */
export const criticalStrokeReadable = createTokenColorSet(criticalStrokeReadableRecipe);

// Critical Stroke Strong

/** @public */
export const criticalStrokeStrongRecipe = createTokenColorRecipeCritical(strokeStrongRecipe);

/** @public */
export const criticalStrokeStrong = createTokenColorSet(criticalStrokeStrongRecipe);

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
export const warningFillIdealRecipe = createTokenColorRecipeWarning(fillIdealRecipe);

/** @public */
export const warningFillIdeal = createTokenColorSet(warningFillIdealRecipe);

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
export const successFillIdealRecipe = createTokenColorRecipeSuccess(fillIdealRecipe);

/** @public */
export const successFillIdeal = createTokenColorSet(successFillIdealRecipe);

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
export const infoFillIdealRecipe = createTokenColorRecipeInfo(fillIdealRecipe);

/** @public */
export const infoFillIdeal = createTokenColorSet(infoFillIdealRecipe);

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

// Neutral Fill Subtle (previously just "Neutral Fill")

/** @public */
export const neutralFillSubtleRecipe = createTokenColorRecipeNeutral(fillSubtleRecipe);

/** @public */
export const neutralFillSubtle = createTokenColorSet(neutralFillSubtleRecipe);

// Neutral Fill Subtle Inverse

/** @public */
export const neutralFillSubtleInverseRecipe = createTokenColorRecipeNeutral(fillSubtleInverseRecipe);

/** @public */
export const neutralFillSubtleInverse = createTokenColorSet(neutralFillSubtleInverseRecipe);

// Neutral Fill Ideal

/** @public */
export const neutralFillIdealRecipe = createTokenColorRecipeNeutral(fillIdealRecipe);

/** @public */
export const neutralFillIdeal = createTokenColorSet(neutralFillIdealRecipe);

// Neutral Fill Discernible (previously "Strong")

/** @public */
export const neutralFillDiscernibleRecipe = createTokenColorRecipeNeutral(fillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernible = createTokenColorSet(neutralFillDiscernibleRecipe);

// Neutral Fill Readable

/** @public */
export const neutralFillReadableRecipe = createTokenColorRecipeNeutral(fillReadableRecipe);

/** @public */
export const neutralFillReadable = createTokenColorSet(neutralFillReadableRecipe);

// Neutral Stroke Safety

/** @public */
export const neutralStrokeSafetyRecipe = createTokenColorRecipeNeutral(strokeSafetyRecipe);

/** @public */
export const neutralStrokeSafety = createTokenColorSet(neutralStrokeSafetyRecipe);

// Neutral Stroke Stealth

/** @public */
export const neutralStrokeStealthRecipe = createTokenColorRecipeNeutral(strokeStealthRecipe);

/** @public */
export const neutralStrokeStealth = createTokenColorSet(neutralStrokeStealthRecipe);

// Neutral Stroke Subtle (previously just "Neutral Stroke")

/** @public */
export const neutralStrokeSubtleRecipe = createTokenColorRecipeNeutral(strokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtle = createTokenColorSet(neutralStrokeSubtleRecipe);

// Neutral Stroke Discernible (previously "Strong")

/** @public */
export const neutralStrokeDiscernibleRecipe = createTokenColorRecipeNeutral(strokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernible = createTokenColorSet(neutralStrokeDiscernibleRecipe);

// Neutral Stroke Readable (previously "Foreground Hint")

/** @public */
export const neutralStrokeReadableRecipe = createTokenColorRecipeNeutral(strokeReadableRecipe);

/** @public */
export const neutralStrokeReadable = createTokenColorSet(neutralStrokeReadableRecipe);

// Neutral Stroke Strong (previously "Foreground")

/** @public */
export const neutralStrokeStrongRecipe = createTokenColorRecipeNeutral(strokeStrongRecipe);

/** @public */
export const neutralStrokeStrong = createTokenColorSet(neutralStrokeStrongRecipe);

/**
 * The {@link Palette} to use for focus stroke recipes.
 *
 * @remarks
 * By default this maps to the {@link accentPalette}.
 * Use a custom palette like `focusStrokePalette.withDefault(PaletteRGB.from("#[HEX_COLOR]"))`.
 *
 * @public
 */
export const focusStrokePalette = createTokenNonCss<Palette>("color.focusStroke.palette", DesignTokenType.palette).withDefault(accentPalette);

/**
 * The minimum contrast for the focus stroke recipe.
 *
 * @remarks
 * By default this maps to the {@link minContrastDiscernible}, which by default meets 3:1 contrast recommendation.
 *
 * @public
 */
export const focusStrokeMinContrast = createTokenNonCss<number>("color.focusStroke.minContrast", DesignTokenType.number).withDefault(minContrastDiscernible);

// Focus Stroke

const focusStrokeName = "color.focusStroke";

/** @public */
export const focusStrokeRecipe = createTokenColorRecipe(
    focusStrokeName,
    [...StylePropertyShorthand.borderFill, StyleProperty.outlineColor],
    (resolve: DesignTokenResolver, params?: ColorRecipeParams): Color =>
        contrastSwatch(
            resolve(focusStrokePalette),
            params?.reference || resolve(colorContext),
            resolve(focusStrokeMinContrast)
        )
);

/** @public */
export const focusStroke = createTokenColorRecipeValue(focusStrokeRecipe);

// Focus Stroke Outer

const focusStrokeOuterName = "color.focusStroke.outer";

/** @public */
export const focusStrokeOuterRecipe = createTokenColorRecipe(
    focusStrokeOuterName,
    StylePropertyShorthand.borderFill,
    (resolve: DesignTokenResolver): Color =>
        blackOrWhiteByContrast(resolve(colorContext), resolve(minContrastReadable), true)
);

/** @public */
export const focusStrokeOuter = createTokenColorRecipeValue(focusStrokeOuterRecipe);

// Focus Stroke Inner

const focusStrokeInnerName = "color.focusStroke.inner";

/** @public */
export const focusStrokeInnerRecipe = createTokenColorRecipe(
    focusStrokeInnerName,
    StylePropertyShorthand.borderFill,
    (resolve: DesignTokenResolver): Color =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), resolve(minContrastReadable), false)
);

/** @public */
export const focusStrokeInner = createTokenColorRecipeValue(focusStrokeInnerRecipe);
