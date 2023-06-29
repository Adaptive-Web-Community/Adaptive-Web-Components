import type { DesignToken, DesignTokenResolver, ValuesOf } from "@microsoft/fast-foundation";
import { ColorRecipe, InteractiveColorRecipe, InteractiveColorRecipeBySet, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { blackOrWhiteByContrast } from "../color/recipes/black-or-white-by-contrast.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { deltaSwatch } from "../color/recipes/delta-swatch.js";
import { Swatch } from "../color/swatch.js";
import { _white } from "../color/utilities/color-constants.js";
import { conditionalSwatchSet } from "../color/utilities/conditional.js";
import { interactiveSwatchSetAsOverlay, swatchAsOverlay } from "../color/utilities/opacity.js";
import { StyleProperty, stylePropertyBorderFillAll } from "../modules/types.js";
import type { InteractiveTokenGroup } from "../types.js";
import { TypedCSSDesignToken } from "../adaptive-design-tokens.js";
import { createNonCss, createTokenSwatch } from "./create.js";
import { accentPalette, neutralPalette } from "./palette.js";

function createDelta(name: string, state: keyof InteractiveSwatchSet, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-${state}-delta`).withDefault(value);
}

function createMinContrast(name: string, value: number | DesignToken<number>): DesignToken<number> {
    return createNonCss<number>(`${name}-min-contrast`).withDefault(value);
}

function createRecipe(name: string, value: (resolve: DesignTokenResolver, reference?: Swatch) => Swatch): DesignToken<ColorRecipe> {
    return createNonCss<ColorRecipe>(`${name}-recipe`).withDefault({
        evaluate: value
    });
}

function createRecipeInteractive(
    name: string, value: (resolve: DesignTokenResolver, reference?: Swatch) => InteractiveSwatchSet
): DesignToken<InteractiveColorRecipe> {
    return createNonCss<InteractiveColorRecipe>(`${name}-recipe`).withDefault({
        evaluate: value
    });
}

function createSet(recipeToken: DesignToken<InteractiveColorRecipe>): DesignToken<InteractiveSwatchSet> {
    return createNonCss<InteractiveSwatchSet>(`${recipeToken.name}-value`).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
}

function createStateToken(
    valueToken: DesignToken<InteractiveSwatchSet>,
    state: keyof InteractiveSwatchSet,
    intendedFor?: StyleProperty | StyleProperty[]
): TypedCSSDesignToken<Swatch> {
    return createTokenSwatch(`${valueToken.name.replace("-recipe-value", "")}-${state}`, intendedFor).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state]
    );
}

function createRecipeToken(
    recipeToken: DesignToken<ColorRecipe>,
    intendedFor?: StyleProperty | StyleProperty[]
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

const fillStealthDeltaName = "fill-stealth";

/** @public */
export const fillStealthRestDelta = createDelta(fillStealthDeltaName, "rest", 0);

/** @public */
export const fillStealthHoverDelta = createDelta(fillStealthDeltaName, "hover", 3);

/** @public */
export const fillStealthActiveDelta = createDelta(fillStealthDeltaName, "active", 2);

/** @public */
export const fillStealthFocusDelta = createDelta(fillStealthDeltaName, "focus", 0);

const fillSubtleDeltaName = "fill-subtle";

/** @public */
export const fillSubtleRestDelta = createDelta(fillSubtleDeltaName, "rest", 2);

/** @public */
export const fillSubtleHoverDelta = createDelta(fillSubtleDeltaName, "hover", 1);

/** @public */
export const fillSubtleActiveDelta = createDelta(fillSubtleDeltaName, "active", 0);

/** @public */
export const fillSubtleFocusDelta = createDelta(fillSubtleDeltaName, "focus", 2);

const fillDiscernibleDeltaName = "fill-discernible";

/** @public */
export const fillDiscernibleRestDelta = createDelta(fillDiscernibleDeltaName, "rest", 0);

/** @public */
export const fillDiscernibleHoverDelta = createDelta(fillDiscernibleDeltaName, "hover", 8);

/** @public */
export const fillDiscernibleActiveDelta = createDelta(fillDiscernibleDeltaName, "active", -5);

/** @public */
export const fillDiscernibleFocusDelta = createDelta(fillDiscernibleDeltaName, "focus", 0);

const fillReadableDeltaName = "fill-readable";

/** @public */
export const fillReadableRestDelta = createDelta(fillReadableDeltaName, "rest", 0);

/** @public */
export const fillReadableHoverDelta = createDelta(fillReadableDeltaName, "hover", -2);

/** @public */
export const fillReadableActiveDelta = createDelta(fillReadableDeltaName, "active", -5);

/** @public */
export const fillReadableFocusDelta = createDelta(fillReadableDeltaName, "focus", 0);

const strokeSafetyDeltaName = "stroke-safety";

/** @public */
export const strokeSafetyRestDelta = createDelta(strokeSafetyDeltaName, "rest", 0);

/** @public */
export const strokeSafetyHoverDelta = createDelta(strokeSafetyDeltaName, "hover", 6);

/** @public */
export const strokeSafetyActiveDelta = createDelta(strokeSafetyDeltaName, "active", -6);

/** @public */
export const strokeSafetyFocusDelta = createDelta(strokeSafetyDeltaName, "focus", 0);

const strokeStealthDeltaName = "stroke-stealth";

/** @public */
export const strokeStealthRestDelta = createDelta(strokeStealthDeltaName, "rest", 0);

/** @public */
export const strokeStealthHoverDelta = createDelta(strokeStealthDeltaName, "hover", 6);

/** @public */
export const strokeStealthActiveDelta = createDelta(strokeStealthDeltaName, "active", -6);

/** @public */
export const strokeStealthFocusDelta = createDelta(strokeStealthDeltaName, "focus", 0);

const strokeSubtleDeltaName = "stroke-subtle";

/** @public */
export const strokeSubtleRestDelta = createDelta(strokeSubtleDeltaName, "rest", 0);

/** @public */
export const strokeSubtleHoverDelta = createDelta(strokeSubtleDeltaName, "hover", 4);

/** @public */
export const strokeSubtleActiveDelta = createDelta(strokeSubtleDeltaName, "active", -2);

/** @public */
export const strokeSubtleFocusDelta = createDelta(strokeSubtleDeltaName, "focus", 0);

const strokeDiscernibleDeltaName = "stroke-discernible";

/** @public */
export const strokeDiscernibleRestDelta = createDelta(strokeDiscernibleDeltaName, "rest", 0);

/** @public */
export const strokeDiscernibleHoverDelta = createDelta(strokeDiscernibleDeltaName, "hover", 8);

/** @public */
export const strokeDiscernibleActiveDelta = createDelta(strokeDiscernibleDeltaName, "active", -4);

/** @public */
export const strokeDiscernibleFocusDelta = createDelta(strokeDiscernibleDeltaName, "focus", 0);

const strokeReadableDeltaName = "stroke-readable";

/** @public */
export const strokeReadableRestDelta = createDelta(strokeReadableDeltaName, "rest", 0);

/** @public */
export const strokeReadableHoverDelta = createDelta(strokeReadableDeltaName, "hover", 6);

/** @public */
export const strokeReadableActiveDelta = createDelta(strokeReadableDeltaName, "active", -6);

/** @public */
export const strokeReadableFocusDelta = createDelta(strokeReadableDeltaName, "focus", 0);

const strokeStrongDeltaName = "stroke-strong";

/** @public */
export const strokeStrongMinContrast = createMinContrast(strokeStrongDeltaName, 12);

/** @public */
export const strokeStrongRestDelta = createDelta(strokeStrongDeltaName, "rest", 0);

/** @public */
export const strokeStrongHoverDelta = createDelta(strokeStrongDeltaName, "hover", 10);

/** @public */
export const strokeStrongActiveDelta = createDelta(strokeStrongDeltaName, "active", -10);

/** @public */
export const strokeStrongFocusDelta = createDelta(strokeStrongDeltaName, "focus", 0);

// Accent Fill Stealth

const accentFillStealthName = "accent-fill-stealth";

/** @public */
export const accentFillStealthRecipe = createRecipeInteractive(accentFillStealthName,
    (resolve: DesignTokenResolver, reference?: Swatch) =>
        deltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(fillStealthRestDelta),
            resolve(fillStealthHoverDelta),
            resolve(fillStealthActiveDelta),
            resolve(fillStealthFocusDelta)
        )
);

const accentFillStealthSet = createSet(accentFillStealthRecipe);

/** @public */
export const accentFillStealthRest = createStateToken(accentFillStealthSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const accentFillStealthHover = createStateToken(accentFillStealthSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const accentFillStealthActive = createStateToken(accentFillStealthSet, "active", StyleProperty.backgroundFill);

/** @public */
export const accentFillStealthFocus = createStateToken(accentFillStealthSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const accentFillStealth: InteractiveTokenGroup<Swatch> = {
    name: accentFillStealthName,
    rest: accentFillStealthRest,
    hover: accentFillStealthHover,
    active: accentFillStealthActive,
    focus: accentFillStealthFocus,
};

// Accent Fill Subtle

const accentFillSubtleName = "accent-fill-subtle";

/** @public */
export const accentFillSubtleRecipe = createRecipeInteractive(accentFillSubtleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(fillSubtleRestDelta),
            resolve(fillSubtleHoverDelta),
            resolve(fillSubtleActiveDelta),
            resolve(fillSubtleFocusDelta)
        )
);

const accentFillSubtleSet = createSet(accentFillSubtleRecipe);

/** @public */
export const accentFillSubtleRest = createStateToken(accentFillSubtleSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const accentFillSubtleHover = createStateToken(accentFillSubtleSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const accentFillSubtleActive = createStateToken(accentFillSubtleSet, "active", StyleProperty.backgroundFill);

/** @public */
export const accentFillSubtleFocus = createStateToken(accentFillSubtleSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const accentFillSubtle: InteractiveTokenGroup<Swatch> = {
    name: accentFillSubtleName,
    rest: accentFillSubtleRest,
    hover: accentFillSubtleHover,
    active: accentFillSubtleActive,
    focus: accentFillSubtleFocus,
};

// Accent Fill Discernible

const accentFillDiscernibleName = "accent-fill-discernible";

/** @public */
export const accentFillDiscernibleRecipe = createRecipeInteractive(accentFillDiscernibleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastDiscernible),
            resolve(fillDiscernibleRestDelta),
            resolve(fillDiscernibleHoverDelta),
            resolve(fillDiscernibleActiveDelta),
            resolve(fillDiscernibleFocusDelta)
        )
);

const accentFillDiscernibleSet = createSet(accentFillDiscernibleRecipe);

/** @public */
export const accentFillDiscernibleRest = createStateToken(accentFillDiscernibleSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const accentFillDiscernibleHover = createStateToken(accentFillDiscernibleSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const accentFillDiscernibleActive = createStateToken(accentFillDiscernibleSet, "active", StyleProperty.backgroundFill);

/** @public */
export const accentFillDiscernibleFocus = createStateToken(accentFillDiscernibleSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const accentFillDiscernible: InteractiveTokenGroup<Swatch> = {
    name: accentFillDiscernibleName,
    rest: accentFillDiscernibleRest,
    hover: accentFillDiscernibleHover,
    active: accentFillDiscernibleActive,
    focus: accentFillDiscernibleFocus,
};

// Accent Fill Readable (previously just "Accent Fill")

const accentFillReadableName = "accent-fill-readable";

/** @public @deprecated Use `fillReadableRestDelta` instead. */
export const accentFillReadableRestDelta = createDelta(accentFillReadableName, "rest", fillReadableRestDelta);

/** @public @deprecated Use `fillReadableHoverDelta` instead. */
export const accentFillReadableHoverDelta = createDelta(accentFillReadableName, "hover", fillReadableHoverDelta);

/** @public @deprecated Use `fillReadableActiveDelta` instead. */
export const accentFillReadableActiveDelta = createDelta(accentFillReadableName, "active", fillReadableActiveDelta);

/** @public @deprecated Use `fillReadableFocusDelta` instead. */
export const accentFillReadableFocusDelta = createDelta(accentFillReadableName, "focus", fillReadableFocusDelta);

/** @public */
export const accentFillReadableRecipe = createRecipeInteractive(accentFillReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch) =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastReadable),
            resolve(accentFillReadableRestDelta),
            resolve(accentFillReadableHoverDelta),
            resolve(accentFillReadableActiveDelta),
            resolve(accentFillReadableFocusDelta)
        )
);

const accentFillReadableSet = createSet(accentFillReadableRecipe);

/** @public */
export const accentFillReadableRest = createStateToken(accentFillReadableSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const accentFillReadableHover = createStateToken(accentFillReadableSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const accentFillReadableActive = createStateToken(accentFillReadableSet, "active", StyleProperty.backgroundFill);

/** @public */
export const accentFillReadableFocus = createStateToken(accentFillReadableSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const accentFillReadable: InteractiveTokenGroup<Swatch> = {
    name: accentFillReadableName,
    rest: accentFillReadableRest,
    hover: accentFillReadableHover,
    active: accentFillReadableActive,
    focus: accentFillReadableFocus,
};

// Foreground On Accent Fill Readable (previously just "Foreground On Accent")

const foregroundOnAccentFillReadableName = "foreground-on-accent-fill-readable";

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRecipe = createRecipeInteractive(foregroundOnAccentFillReadableName,
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

const foregroundOnAccentFillReadableSet = createSet(foregroundOnAccentFillReadableRecipe);

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRest = createStateToken(foregroundOnAccentFillReadableSet, "rest");

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableHover = createStateToken(foregroundOnAccentFillReadableSet, "hover");

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableActive = createStateToken(foregroundOnAccentFillReadableSet, "active");

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableFocus = createStateToken(foregroundOnAccentFillReadableSet, "focus");

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadable: InteractiveTokenGroup<Swatch> = {
    name: foregroundOnAccentFillReadableName,
    rest: foregroundOnAccentFillReadableRest,
    hover: foregroundOnAccentFillReadableHover,
    active: foregroundOnAccentFillReadableActive,
    focus: foregroundOnAccentFillReadableFocus,
};

// Accent Stroke Safety

const accentStrokeSafetyName = "accent-stroke-safety";

/** @public */
export const accentStrokeSafetyRecipe = createRecipeInteractive(accentStrokeSafetyName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        conditionalSwatchSet(
            contrastAndDeltaSwatchSet(
                resolve(accentPalette),
                reference || resolve(fillColor),
                resolve(minContrastSafety),
                resolve(strokeSafetyRestDelta),
                resolve(strokeSafetyHoverDelta),
                resolve(strokeSafetyActiveDelta),
                resolve(strokeSafetyFocusDelta)
            ),
        resolve(minContrastSafety) > 0
    )
);

const accentStrokeSafetySet = createSet(accentStrokeSafetyRecipe);

/** @public */
export const accentStrokeSafetyRest = createStateToken(accentStrokeSafetySet, "rest", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSafetyHover = createStateToken(accentStrokeSafetySet, "hover", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSafetyActive = createStateToken(accentStrokeSafetySet, "active", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSafetyFocus = createStateToken(accentStrokeSafetySet, "focus", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSafety: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeSafetyName,
    rest: accentStrokeSafetyRest,
    hover: accentStrokeSafetyHover,
    active: accentStrokeSafetyActive,
    focus: accentStrokeSafetyFocus,
};

// Accent Stroke Stealth

const accentStrokeStealthName = "accent-stroke-stealth";

/** @public */
export const accentStrokeStealthRecipe = createRecipeInteractive(accentStrokeStealthName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastSafety),
            resolve(strokeStealthRestDelta),
            resolve(strokeStealthHoverDelta),
            resolve(strokeStealthActiveDelta),
            resolve(strokeStealthFocusDelta)
        )
);

const accentStrokeStealthSet = createSet(accentStrokeStealthRecipe);

/** @public */
export const accentStrokeStealthRest = createStateToken(accentStrokeStealthSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeStealthHover = createStateToken(accentStrokeStealthSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeStealthActive = createStateToken(accentStrokeStealthSet, "active", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeStealthFocus = createStateToken(accentStrokeStealthSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeStealth: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeStealthName,
    rest: accentStrokeStealthRest,
    hover: accentStrokeStealthHover,
    active: accentStrokeStealthActive,
    focus: accentStrokeStealthFocus,
};

// Accent Stroke Subtle

const accentStrokeSubtleName = "accent-stroke-subtle";

/** @public */
export const accentStrokeSubtleRecipe = createRecipeInteractive(accentStrokeSubtleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastSubtle),
            resolve(strokeSubtleRestDelta),
            resolve(strokeSubtleHoverDelta),
            resolve(strokeSubtleActiveDelta),
            resolve(strokeSubtleFocusDelta)
        )
);

const accentStrokeSubtleSet = createSet(accentStrokeSubtleRecipe);

/** @public */
export const accentStrokeSubtleRest = createStateToken(accentStrokeSubtleSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSubtleHover = createStateToken(accentStrokeSubtleSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSubtleActive = createStateToken(accentStrokeSubtleSet, "active", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSubtleFocus = createStateToken(accentStrokeSubtleSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeSubtle: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeSubtleName,
    rest: accentStrokeSubtleRest,
    hover: accentStrokeSubtleHover,
    active: accentStrokeSubtleActive,
    focus: accentStrokeSubtleFocus,
};

// Accent Stroke Discernible

const accentStrokeDiscernibleName = "accent-stroke-discernible";

/** @public */
export const accentStrokeDiscernibleRecipe = createRecipeInteractive(accentStrokeDiscernibleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastDiscernible),
            resolve(strokeDiscernibleRestDelta),
            resolve(strokeDiscernibleHoverDelta),
            resolve(strokeDiscernibleActiveDelta),
            resolve(strokeDiscernibleFocusDelta)
        )
);

const accentStrokeDiscernibleSet = createSet(accentStrokeDiscernibleRecipe);

/** @public */
export const accentStrokeDiscernibleRest = createStateToken(accentStrokeDiscernibleSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeDiscernibleHover = createStateToken(accentStrokeDiscernibleSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeDiscernibleActive = createStateToken(accentStrokeDiscernibleSet, "active", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeDiscernibleFocus = createStateToken(accentStrokeDiscernibleSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const accentStrokeDiscernible: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeDiscernibleName,
    rest: accentStrokeDiscernibleRest,
    hover: accentStrokeDiscernibleHover,
    active: accentStrokeDiscernibleActive,
    focus: accentStrokeDiscernibleFocus,
};

// Accent Stroke Readable (previously "Foreground")

const accentStrokeReadableName = "accent-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const accentStrokeReadableRestDelta = createDelta(accentStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const accentStrokeReadableHoverDelta = createDelta(accentStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const accentStrokeReadableActiveDelta = createDelta(accentStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const accentStrokeReadableFocusDelta = createDelta(accentStrokeReadableName, "focus", strokeReadableFocusDelta);

/** @public */
export const accentStrokeReadableRecipe = createRecipeInteractive(accentStrokeReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(minContrastReadable),
            resolve(accentStrokeReadableRestDelta),
            resolve(accentStrokeReadableHoverDelta),
            resolve(accentStrokeReadableActiveDelta),
            resolve(accentStrokeReadableFocusDelta)
        )
);

const accentStrokeReadableSet = createSet(accentStrokeReadableRecipe);

/** @public */
export const accentStrokeReadableRest = createStateToken(accentStrokeReadableSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeReadableHover = createStateToken(accentStrokeReadableSet, "hover", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeReadableActive = createStateToken(accentStrokeReadableSet, "active", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeReadableFocus = createStateToken(accentStrokeReadableSet, "focus", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeReadable: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeReadableName,
    rest: accentStrokeReadableRest,
    hover: accentStrokeReadableHover,
    active: accentStrokeReadableActive,
    focus: accentStrokeReadableFocus,
};

// Accent Stroke Strong

const accentStrokeStrongName = "accent-stroke-strong";

/** @public */
export const accentStrokeStrongRecipe = createRecipeInteractive(accentStrokeStrongName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(strokeStrongMinContrast),
            resolve(strokeStrongRestDelta),
            resolve(strokeStrongHoverDelta),
            resolve(strokeStrongActiveDelta),
            resolve(strokeStrongFocusDelta)
        )
);

const accentStrokeStrongSet = createSet(accentStrokeStrongRecipe);

/** @public */
export const accentStrokeStrongRest = createStateToken(accentStrokeStrongSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeStrongHover = createStateToken(accentStrokeStrongSet, "hover", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeStrongActive = createStateToken(accentStrokeStrongSet, "active", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeStrongFocus = createStateToken(accentStrokeStrongSet, "focus", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const accentStrokeStrong: InteractiveTokenGroup<Swatch> = {
    name: accentStrokeStrongName,
    rest: accentStrokeStrongRest,
    hover: accentStrokeStrongHover,
    active: accentStrokeStrongActive,
    focus: accentStrokeStrongFocus,
};

// Neutral Fill Stealth

const neutralFillStealthName = "neutral-fill-stealth";

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthRestDelta = createDelta(neutralFillStealthName, "rest", fillStealthRestDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthHoverDelta = createDelta(neutralFillStealthName, "hover", fillStealthHoverDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthActiveDelta = createDelta(neutralFillStealthName, "active", fillStealthActiveDelta);

/** @public @deprecated Use `fillStealthRestDelta` instead. */
export const neutralFillStealthFocusDelta = createDelta(neutralFillStealthName, "focus", fillStealthFocusDelta);

/** @public */
export const neutralFillStealthRecipe = createRecipeInteractive(neutralFillStealthName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillStealthRestDelta),
                resolve(neutralFillStealthHoverDelta),
                resolve(neutralFillStealthActiveDelta),
                resolve(neutralFillStealthFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillStealthSet = createSet(neutralFillStealthRecipe);

/** @public */
export const neutralFillStealthRest = createStateToken(neutralFillStealthSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const neutralFillStealthHover = createStateToken(neutralFillStealthSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const neutralFillStealthActive = createStateToken(neutralFillStealthSet, "active", StyleProperty.backgroundFill);

/** @public */
export const neutralFillStealthFocus = createStateToken(neutralFillStealthSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const neutralFillStealth: InteractiveTokenGroup<Swatch> = {
    name: neutralFillStealthName,
    rest: neutralFillStealthRest,
    hover: neutralFillStealthHover,
    active: neutralFillStealthActive,
    focus: neutralFillStealthFocus,
};

// Neutral Fill Subtle (previously just "Neutral Fill")

const neutralFillSubtleName = "neutral-fill-subtle";

/** @public @deprecated Use `fillSubtleRestDelta` instead. */
export const neutralFillSubtleRestDelta = createDelta(neutralFillSubtleName, "rest", fillSubtleRestDelta);

/** @public @deprecated Use `fillSubtleHoverDelta` instead. */
export const neutralFillSubtleHoverDelta = createDelta(neutralFillSubtleName, "hover", fillSubtleHoverDelta);

/** @public @deprecated Use `fillSubtleActiveDelta` instead. */
export const neutralFillSubtleActiveDelta = createDelta(neutralFillSubtleName, "active", fillSubtleActiveDelta);

/** @public @deprecated Use `fillSubtleFocusDelta` instead. */
export const neutralFillSubtleFocusDelta = createDelta(neutralFillSubtleName, "focus", fillSubtleFocusDelta);

/** @public */
export const neutralFillSubtleRecipe = createRecipeInteractive(neutralFillSubtleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillSubtleRestDelta),
                resolve(neutralFillSubtleHoverDelta),
                resolve(neutralFillSubtleActiveDelta),
                resolve(neutralFillSubtleFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillSubtleSet = createSet(neutralFillSubtleRecipe);

/** @public */
export const neutralFillSubtleRest = createStateToken(neutralFillSubtleSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const neutralFillSubtleHover = createStateToken(neutralFillSubtleSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const neutralFillSubtleActive = createStateToken(neutralFillSubtleSet, "active", StyleProperty.backgroundFill);

/** @public */
export const neutralFillSubtleFocus = createStateToken(neutralFillSubtleSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const neutralFillSubtle: InteractiveTokenGroup<Swatch> = {
    name: neutralFillSubtleName,
    rest: neutralFillSubtleRest,
    hover: neutralFillSubtleHover,
    active: neutralFillSubtleActive,
    focus: neutralFillSubtleFocus,
};

// Neutral Fill Discernible (previously "Strong")

const neutralFillDiscernibleName = "neutral-fill-discernible";

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleRestDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleRestDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleHoverDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleHoverDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleActiveDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleActiveDelta);

/** @public @deprecated Use `fillDiscernibleRestDelta` instead. */
export const neutralFillDiscernibleFocusDelta = createDelta(neutralFillDiscernibleName, "rest", fillDiscernibleFocusDelta);

/** @public */
export const neutralFillDiscernibleRecipe = createRecipeInteractive(neutralFillDiscernibleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastDiscernible),
                resolve(neutralFillDiscernibleRestDelta),
                resolve(neutralFillDiscernibleHoverDelta),
                resolve(neutralFillDiscernibleActiveDelta),
                resolve(neutralFillDiscernibleFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillDiscernibleSet = createSet(neutralFillDiscernibleRecipe);

/** @public */
export const neutralFillDiscernibleRest = createStateToken(neutralFillDiscernibleSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const neutralFillDiscernibleHover = createStateToken(neutralFillDiscernibleSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const neutralFillDiscernibleActive = createStateToken(neutralFillDiscernibleSet, "active", StyleProperty.backgroundFill);

/** @public */
export const neutralFillDiscernibleFocus = createStateToken(neutralFillDiscernibleSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const neutralFillDiscernible: InteractiveTokenGroup<Swatch> = {
    name: neutralFillDiscernibleName,
    rest: neutralFillDiscernibleRest,
    hover: neutralFillDiscernibleHover,
    active: neutralFillDiscernibleActive,
    focus: neutralFillDiscernibleFocus,
};

// Neutral Fill Readable

const neutralFillReadableName = "neutral-fill-readable";

/** @public */
export const neutralFillReadableRecipe = createRecipeInteractive(neutralFillReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch) =>
        contrastAndDeltaSwatchSet(
            resolve(neutralPalette),
            reference || resolve(fillColor),
            resolve(minContrastReadable),
            resolve(fillReadableRestDelta),
            resolve(fillReadableHoverDelta),
            resolve(fillReadableActiveDelta),
            resolve(fillReadableFocusDelta)
        )
);

const neutralFillReadableSet = createSet(neutralFillReadableRecipe);

/** @public */
export const neutralFillReadableRest = createStateToken(neutralFillReadableSet, "rest", StyleProperty.backgroundFill);

/** @public */
export const neutralFillReadableHover = createStateToken(neutralFillReadableSet, "hover", StyleProperty.backgroundFill);

/** @public */
export const neutralFillReadableActive = createStateToken(neutralFillReadableSet, "active", StyleProperty.backgroundFill);

/** @public */
export const neutralFillReadableFocus = createStateToken(neutralFillReadableSet, "focus", StyleProperty.backgroundFill);

/** @public */
export const neutralFillReadable: InteractiveTokenGroup<Swatch> = {
    name: neutralFillReadableName,
    rest: neutralFillReadableRest,
    hover: neutralFillReadableHover,
    active: neutralFillReadableActive,
    focus: neutralFillReadableFocus,
};

// Neutral Stroke Safety

const neutralStrokeSafetyName = "neutral-stroke-safety";

/** @public */
export const neutralStrokeSafetyRecipe = createRecipeInteractive(neutralStrokeSafetyName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        conditionalSwatchSet(
            interactiveSwatchSetAsOverlay(
                contrastAndDeltaSwatchSet(
                    resolve(neutralPalette),
                    reference || resolve(fillColor),
                    resolve(minContrastSafety),
                    resolve(strokeSafetyRestDelta),
                    resolve(strokeSafetyHoverDelta),
                    resolve(strokeSafetyActiveDelta),
                    resolve(strokeSafetyFocusDelta)
                ),
                reference || resolve(fillColor),
                resolve(neutralAsOverlay)
            ),
        resolve(minContrastSafety) > 0
    )
);

const neutralStrokeSafetySet = createSet(neutralStrokeSafetyRecipe);

/** @public */
export const neutralStrokeSafetyRest = createStateToken(neutralStrokeSafetySet, "rest", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSafetyHover = createStateToken(neutralStrokeSafetySet, "hover", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSafetyActive = createStateToken(neutralStrokeSafetySet, "active", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSafetyFocus = createStateToken(neutralStrokeSafetySet, "focus", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSafety: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeSafetyName,
    rest: neutralStrokeSafetyRest,
    hover: neutralStrokeSafetyHover,
    active: neutralStrokeSafetyActive,
    focus: neutralStrokeSafetyFocus,
};

// Neutral Stroke Stealth

const neutralStrokeStealthName = "neutral-stroke-stealth";

/** @public */
export const neutralStrokeStealthRecipe = createRecipeInteractive(neutralStrokeStealthName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastSafety),
                resolve(strokeStealthRestDelta),
                resolve(strokeStealthHoverDelta),
                resolve(strokeStealthActiveDelta),
                resolve(strokeStealthFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeStealthSet = createSet(neutralStrokeStealthRecipe);

/** @public */
export const neutralStrokeStealthRest = createStateToken(neutralStrokeStealthSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeStealthHover = createStateToken(neutralStrokeStealthSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeStealthActive = createStateToken(neutralStrokeStealthSet, "active", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeStealthFocus = createStateToken(neutralStrokeStealthSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeStealth: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeStealthName,
    rest: neutralStrokeStealthRest,
    hover: neutralStrokeStealthHover,
    active: neutralStrokeStealthActive,
    focus: neutralStrokeStealthFocus,
};

// Neutral Stroke Subtle (previously just "Neutral Stroke")

const neutralStrokeSubtleName = "neutral-stroke-subtle";

/** @public @deprecated Use `strokeSubtleRestDelta` instead. */
export const neutralStrokeSubtleRestDelta = createDelta(neutralStrokeSubtleName, "rest", strokeSubtleRestDelta);

/** @public @deprecated Use `strokeSubtleHoverDelta` instead. */
export const neutralStrokeSubtleHoverDelta = createDelta(neutralStrokeSubtleName, "hover", strokeSubtleHoverDelta);

/** @public @deprecated Use `strokeSubtleActiveDelta` instead. */
export const neutralStrokeSubtleActiveDelta = createDelta(neutralStrokeSubtleName, "active", strokeSubtleActiveDelta);

/** @public @deprecated Use `strokeSubtleFocusDelta` instead. */
export const neutralStrokeSubtleFocusDelta = createDelta(neutralStrokeSubtleName, "focus", strokeSubtleFocusDelta);

/** @public */
export const neutralStrokeSubtleRecipe = createRecipeInteractive(neutralStrokeSubtleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastSubtle),
                resolve(neutralStrokeSubtleRestDelta),
                resolve(neutralStrokeSubtleHoverDelta),
                resolve(neutralStrokeSubtleActiveDelta),
                resolve(neutralStrokeSubtleFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeSubtleSet = createSet(neutralStrokeSubtleRecipe);

/** @public */
export const neutralStrokeSubtleRest = createStateToken(neutralStrokeSubtleSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSubtleHover = createStateToken(neutralStrokeSubtleSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSubtleActive = createStateToken(neutralStrokeSubtleSet, "active", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSubtleFocus = createStateToken(neutralStrokeSubtleSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeSubtle: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeSubtleName,
    rest: neutralStrokeSubtleRest,
    hover: neutralStrokeSubtleHover,
    active: neutralStrokeSubtleActive,
    focus: neutralStrokeSubtleFocus,
};

// Neutral Stroke Discernible (previously "Strong")

const neutralStrokeDiscernibleName = "neutral-stroke-discernible";

/** @public @deprecated Use `strokeDiscernibleRestDelta` instead. */
export const neutralStrokeDiscernibleRestDelta = createDelta(neutralStrokeDiscernibleName, "rest", strokeDiscernibleRestDelta);

/** @public @deprecated Use `strokeDiscernibleHoverDelta` instead. */
export const neutralStrokeDiscernibleHoverDelta = createDelta(neutralStrokeDiscernibleName, "hover", strokeDiscernibleHoverDelta);

/** @public @deprecated Use `strokeDiscernibleActiveDelta` instead. */
export const neutralStrokeDiscernibleActiveDelta = createDelta(neutralStrokeDiscernibleName, "active", strokeDiscernibleActiveDelta);

/** @public @deprecated Use `strokeDiscernibleFocusDelta` instead. */
export const neutralStrokeDiscernibleFocusDelta = createDelta(neutralStrokeDiscernibleName, "focus", strokeDiscernibleFocusDelta);

/** @public */
export const neutralStrokeDiscernibleRecipe = createRecipeInteractive(neutralStrokeDiscernibleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastDiscernible),
                resolve(neutralStrokeDiscernibleRestDelta),
                resolve(neutralStrokeDiscernibleHoverDelta),
                resolve(neutralStrokeDiscernibleActiveDelta),
                resolve(neutralStrokeDiscernibleFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeDiscernibleSet = createSet(neutralStrokeDiscernibleRecipe);

/** @public */
export const neutralStrokeDiscernibleRest = createStateToken(neutralStrokeDiscernibleSet, "rest", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeDiscernibleHover = createStateToken(neutralStrokeDiscernibleSet, "hover", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeDiscernibleActive = createStateToken(neutralStrokeDiscernibleSet, "active", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeDiscernibleFocus = createStateToken(neutralStrokeDiscernibleSet, "focus", stylePropertyBorderFillAll);

/** @public */
export const neutralStrokeDiscernible: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeDiscernibleName,
    rest: neutralStrokeDiscernibleRest,
    hover: neutralStrokeDiscernibleHover,
    active: neutralStrokeDiscernibleActive,
    focus: neutralStrokeDiscernibleFocus,
};

// Neutral Stroke Readable (previously "Foreground Hint")

const neutralStrokeReadableName = "neutral-stroke-readable";

/** @public @deprecated Use `strokeReadableRestDelta` instead. */
export const neutralStrokeReadableRestDelta = createDelta(neutralStrokeReadableName, "rest", strokeReadableRestDelta);

/** @public @deprecated Use `strokeReadableHoverDelta` instead. */
export const neutralStrokeReadableHoverDelta = createDelta(neutralStrokeReadableName, "hover", strokeReadableHoverDelta);

/** @public @deprecated Use `strokeReadableActiveDelta` instead. */
export const neutralStrokeReadableActiveDelta = createDelta(neutralStrokeReadableName, "active", strokeReadableActiveDelta);

/** @public @deprecated Use `strokeReadableFocusDelta` instead. */
export const neutralStrokeReadableFocusDelta = createDelta(neutralStrokeReadableName, "focus", strokeReadableFocusDelta);

/** @public */
export const neutralStrokeReadableRecipe = createRecipeInteractive(neutralStrokeReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastReadable),
                resolve(neutralStrokeReadableRestDelta),
                resolve(neutralStrokeReadableHoverDelta),
                resolve(neutralStrokeReadableActiveDelta),
                resolve(neutralStrokeReadableFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeReadableSet = createSet(neutralStrokeReadableRecipe);

/** @public */
export const neutralStrokeReadableRest = createStateToken(neutralStrokeReadableSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeReadableHover = createStateToken(neutralStrokeReadableSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeReadableActive = createStateToken(neutralStrokeReadableSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeReadableFocus = createStateToken(neutralStrokeReadableSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeReadable: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeReadableName,
    rest: neutralStrokeReadableRest,
    hover: neutralStrokeReadableHover,
    active: neutralStrokeReadableActive,
    focus: neutralStrokeReadableFocus,
};

// Neutral Stroke Strong (previously "Foreground")

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

/** @public */
export const neutralStrokeStrongRecipe = createRecipeInteractive(neutralStrokeStrongName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeStrongMinContrast),
                resolve(neutralStrokeStrongRestDelta),
                resolve(neutralStrokeStrongHoverDelta),
                resolve(neutralStrokeStrongActiveDelta),
                resolve(neutralStrokeStrongFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeStrongSet = createSet(neutralStrokeStrongRecipe);

/** @public */
export const neutralStrokeStrongRest = createStateToken(neutralStrokeStrongSet, "rest", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeStrongHover = createStateToken(neutralStrokeStrongSet, "hover", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeStrongActive = createStateToken(neutralStrokeStrongSet, "active", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeStrongFocus = createStateToken(neutralStrokeStrongSet, "focus", [...stylePropertyBorderFillAll, StyleProperty.foregroundFill]);

/** @public */
export const neutralStrokeStrong: InteractiveTokenGroup<Swatch> = {
    name: neutralStrokeStrongName,
    rest: neutralStrokeStrongRest,
    hover: neutralStrokeStrongHover,
    active: neutralStrokeStrongActive,
    focus: neutralStrokeStrongFocus,
};

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

/** @public @deprecated use "Readable" instead */
export const accentFillRestDelta = accentFillReadableRestDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillHoverDelta = accentFillReadableHoverDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillActiveDelta = accentFillReadableActiveDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillFocusDelta = accentFillReadableFocusDelta;

/** @public @deprecated use "Readable" instead */
export const accentFillRecipe = accentFillReadableRecipe;

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
export const accentForegroundRecipe = accentStrokeReadableRecipe;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundRest = accentStrokeReadableRest;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundHover = accentStrokeReadableHover;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundActive = accentStrokeReadableActive;

/** @public @deprecated use "Stroke Readable" instead */
export const accentForegroundFocus = accentStrokeReadableFocus;

/** @public @deprecated Use "Stroke Readable" instead */
export const neutralForegroundHintRecipe = neutralStrokeReadableRecipe;

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
export const neutralForegroundRecipe = neutralStrokeStrongRecipe;

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
export const neutralFillRecipe = neutralFillSubtleRecipe;

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
export const neutralFillInputRecipe = createRecipeInteractive(neutralFillInputName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillInputRestDelta),
                resolve(neutralFillInputHoverDelta),
                resolve(neutralFillInputActiveDelta),
                resolve(neutralFillInputFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralFillInputSet = createSet(neutralFillInputRecipe);

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputRest = createStateToken(neutralFillInputSet, "rest");

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputHover = createStateToken(neutralFillInputSet, "hover");

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputActive = createStateToken(neutralFillInputSet, "active");

/** @public @deprecated Use "Subtle" instead */
export const neutralFillInputFocus = createStateToken(neutralFillInputSet, "focus");

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
export const neutralFillSecondaryRecipe = createRecipeInteractive(neutralFillSecondaryName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillSecondaryRestDelta),
                resolve(neutralFillSecondaryHoverDelta),
                resolve(neutralFillSecondaryActiveDelta),
                resolve(neutralFillSecondaryFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralFillSecondarySet = createSet(neutralFillSecondaryRecipe);

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryRest = createStateToken(neutralFillSecondarySet, "rest");

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryHover = createStateToken(neutralFillSecondarySet, "hover");

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryActive = createStateToken(neutralFillSecondarySet, "active");

/** @public @deprecated Use "Subtle" or "Discernible" instead */
export const neutralFillSecondaryFocus = createStateToken(neutralFillSecondarySet, "focus");

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongRestDelta = neutralFillDiscernibleRestDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongHoverDelta = neutralFillDiscernibleHoverDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongActiveDelta = neutralFillDiscernibleActiveDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongFocusDelta = neutralFillDiscernibleFocusDelta;

/** @public @deprecated Use "Discernible instead of "Strong" */
export const neutralFillStrongRecipe = neutralFillDiscernibleRecipe;

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
export const neutralStrokeRecipe = neutralStrokeSubtleRecipe;

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
    (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        swatchAsOverlay(
            deltaSwatch(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeDividerRestDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeDividerRest = createRecipeToken(neutralStrokeDividerRecipe);

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
export const neutralStrokeInputRecipe = createRecipeInteractive(neutralStrokeInputName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeInputRestDelta),
                resolve(neutralStrokeInputHoverDelta),
                resolve(neutralStrokeInputActiveDelta),
                resolve(neutralStrokeInputFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @deprecated */
const neutralStrokeInputSet = createSet(neutralStrokeInputRecipe);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRest = createStateToken(neutralStrokeInputSet, "rest");

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHover = createStateToken(neutralStrokeInputSet, "hover");

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActive = createStateToken(neutralStrokeInputSet, "active");

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocus = createStateToken(neutralStrokeInputSet, "focus");
