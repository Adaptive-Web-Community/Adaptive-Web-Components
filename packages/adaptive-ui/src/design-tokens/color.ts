import { DesignTokenResolver } from "@microsoft/fast-foundation";
import type { CSSDesignToken, DesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { blackOrWhiteByContrast, interactiveSwatchSetAsOverlay, swatchAsOverlay } from "../color/index.js";
import { ColorRecipe, InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
import { contrastSwatch } from "../color/recipes/contrast-swatch.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { deltaSwatch } from "../color/recipes/delta-swatch.js";
import { Swatch } from "../color/swatch.js";
import { _white } from "../color/utilities/color-constants.js";
import { create, createNonCss } from "./create.js";
import { accentPalette, neutralPalette } from "./palette.js";

function createDelta(name: string, state: keyof InteractiveSwatchSet, value: number): DesignToken<number> {
    return createNonCss<number>(`${name}-${state}-delta`).withDefault(value);
}

function createMinContrast(name: string, value: number | DesignToken<number>) {
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

function createStateToken(valueToken: DesignToken<InteractiveSwatchSet>, state: keyof InteractiveSwatchSet): CSSDesignToken<Swatch> {
    return create<Swatch>(`${valueToken.name.replace("-recipe-value", "")}-${state}`).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(valueToken)[state]
    );
}

function createRecipeToken(recipeToken: DesignToken<ColorRecipe>): CSSDesignToken<Swatch> {
    return create<Swatch>(`${recipeToken.name.replace("-recipe-value", "")}`).withDefault(
        (resolve: DesignTokenResolver) =>
            resolve(recipeToken).evaluate(resolve)
    );
}

/**
 * Convenience values for WCAG contrast requirements.
 *
 * @public
 * @deprecated Use `minContrastPerceivable` or `minContrastReadable` tokens instead
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
export const minContrastPerceivable = createNonCss<number>("min-contrast-perceivable").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 3 : 4.5
);

/** @public */
export const minContrastReadable = createNonCss<number>("min-contrast-readable").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(wcagContrastLevel) === "aa" ? 4.5 : 7
);

/** @public */
export const fillColor = create<Swatch>("fill-color").withDefault(_white);

/** @public */
export const neutralAsOverlay = createNonCss<boolean>("neutral-as-overlay").withDefault(false);

// Accent Fill Readable (previously just "Accent Fill")

const accentFillReadableName = "accent-fill-readable";

/** @public */
export const accentFillReadableMinContrast = createMinContrast(accentFillReadableName, minContrastReadable);

/** @public */
export const accentFillReadableRestDelta = createDelta(accentFillReadableName, "rest", 0);

/** @public */
export const accentFillReadableHoverDelta = createDelta(accentFillReadableName, "hover", -2);

/** @public */
export const accentFillReadableActiveDelta = createDelta(accentFillReadableName, "active", -5);

/** @public */
export const accentFillReadableFocusDelta = createDelta(accentFillReadableName, "focus", 0);

/** @public */
export const accentFillReadableRecipe = createRecipeInteractive(accentFillReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch) =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(accentFillReadableMinContrast),
            resolve(accentFillReadableRestDelta),
            resolve(accentFillReadableHoverDelta),
            resolve(accentFillReadableActiveDelta),
            resolve(accentFillReadableFocusDelta)
        )
);

const accentFillReadableSet = createSet(accentFillReadableRecipe);

/** @public */
export const accentFillReadableRest = createStateToken(accentFillReadableSet, "rest");

/** @public */
export const accentFillReadableHover = createStateToken(accentFillReadableSet, "hover");

/** @public */
export const accentFillReadableActive = createStateToken(accentFillReadableSet, "active");

/** @public */
export const accentFillReadableFocus = createStateToken(accentFillReadableSet, "focus");

/** @public @deprecated use "Readable" instead */
export const accentFillMinContrast = accentFillReadableMinContrast;

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

// Foreground On Accent

const foregroundOnAccentName = "foreground-on-accent";

/** @public */
export const foregroundOnAccentRecipe = createRecipeInteractive(foregroundOnAccentName,
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

const foregroundOnAccentSet = createSet(foregroundOnAccentRecipe);

/** @public */
export const foregroundOnAccentRest = createStateToken(foregroundOnAccentSet, "rest");

/** @public */
export const foregroundOnAccentHover = createStateToken(foregroundOnAccentSet, "hover");

/** @public */
export const foregroundOnAccentActive = createStateToken(foregroundOnAccentSet, "active");

/** @public */
export const foregroundOnAccentFocus = createStateToken(foregroundOnAccentSet, "focus");

// Accent Foreground

const accentForegroundName = "accent-foreground";

/** @public */
export const accentForegroundMinContrast = createMinContrast(accentForegroundName, minContrastReadable);

/** @public */
export const accentForegroundRestDelta = createDelta(accentForegroundName, "rest", 0);

/** @public */
export const accentForegroundHoverDelta = createDelta(accentForegroundName, "hover", 3);

/** @public */
export const accentForegroundActiveDelta = createDelta(accentForegroundName, "active", -8);

/** @public */
export const accentForegroundFocusDelta = createDelta(accentForegroundName, "focus", 0);

/** @public */
export const accentForegroundRecipe = createRecipeInteractive(accentForegroundName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(accentForegroundMinContrast),
            resolve(accentForegroundRestDelta),
            resolve(accentForegroundHoverDelta),
            resolve(accentForegroundActiveDelta),
            resolve(accentForegroundFocusDelta)
        )
);

const accentForegroundSet = createSet(accentForegroundRecipe);

/** @public */
export const accentForegroundRest = createStateToken(accentForegroundSet, "rest");

/** @public */
export const accentForegroundHover = createStateToken(accentForegroundSet, "hover");

/** @public */
export const accentForegroundActive = createStateToken(accentForegroundSet, "active");

/** @public */
export const accentForegroundFocus = createStateToken(accentForegroundSet, "focus");

// Neutral Foreground

const neutralForegroundName = "neutral-foreground";

/** @public */
export const neutralForegroundMinContrast = createMinContrast(neutralForegroundName, 16);

/** @public */
export const neutralForegroundRestDelta = createDelta(neutralForegroundName, "rest", 0);

/** @public */
export const neutralForegroundHoverDelta = createDelta(neutralForegroundName, "hover", -19);

/** @public */
export const neutralForegroundActiveDelta = createDelta(neutralForegroundName, "active", -30);

/** @public */
export const neutralForegroundFocusDelta = createDelta(neutralForegroundName, "focus", 0);

/** @public */
export const neutralForegroundRecipe = createRecipeInteractive(neutralForegroundName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralForegroundMinContrast),
                resolve(neutralForegroundRestDelta),
                resolve(neutralForegroundHoverDelta),
                resolve(neutralForegroundActiveDelta),
                resolve(neutralForegroundFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralForegroundSet = createSet(neutralForegroundRecipe);

/** @public */
export const neutralForegroundRest = createStateToken(neutralForegroundSet, "rest");

/** @public */
export const neutralForegroundHover = createStateToken(neutralForegroundSet, "hover");

/** @public */
export const neutralForegroundActive = createStateToken(neutralForegroundSet, "active");

/** @public */
export const neutralForegroundFocus = createStateToken(neutralForegroundSet, "focus");

// Neutral Stroke Readable (previously "Foreground Hint")

const neutralStrokeReadableName = "neutral-stroke-readable";

/** @public */
export const neutralStrokeReadableRecipe = createRecipe(neutralStrokeReadableName,
    (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        swatchAsOverlay(
            contrastSwatch(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(minContrastReadable)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @public */
export const neutralStrokeReadableRest = createRecipeToken(neutralStrokeReadableRecipe)

/** @public @deprecated Use "Stroke Readable" instead */
export const neutralForegroundHintRecipe = neutralStrokeReadableRecipe;

/** @public @deprecated Use "Stroke Readable" instead */
export const neutralForegroundHint = neutralStrokeReadableRest;

// Neutral Fill Subtle (previously just "Neutral Fill")

const neutralFillSubtleName = "neutral-fill-subtle";

/** @public */
export const neutralFillSubtleRestDelta = createDelta(neutralFillSubtleName, "rest", 2);

/** @public */
export const neutralFillSubtleHoverDelta = createDelta(neutralFillSubtleName, "hover", 1);

/** @public */
export const neutralFillSubtleActiveDelta = createDelta(neutralFillSubtleName, "active", 0);

/** @public */
export const neutralFillSubtleFocusDelta = createDelta(neutralFillSubtleName, "focus", 0);

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
export const neutralFillSubtleRest = createStateToken(neutralFillSubtleSet, "rest");

/** @public */
export const neutralFillSubtleHover = createStateToken(neutralFillSubtleSet, "hover");

/** @public */
export const neutralFillSubtleActive = createStateToken(neutralFillSubtleSet, "active");

/** @public */
export const neutralFillSubtleFocus = createStateToken(neutralFillSubtleSet, "focus");

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

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryRestDelta = createDelta(neutralFillSecondaryName, "rest", 3);

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryHoverDelta = createDelta(neutralFillSecondaryName, "hover", 2);

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryActiveDelta = createDelta(neutralFillSecondaryName, "active", 1);

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryFocusDelta = createDelta(neutralFillSecondaryName, "focus", 3);

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
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

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryRest = createStateToken(neutralFillSecondarySet, "rest");

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryHover = createStateToken(neutralFillSecondarySet, "hover");

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryActive = createStateToken(neutralFillSecondarySet, "active");

/** @public @deprecated Use "Subtle" or "Perceivable" instead */
export const neutralFillSecondaryFocus = createStateToken(neutralFillSecondarySet, "focus");

// Neutral Fill Stealth

const neutralFillStealthName = "neutral-fill-stealth";

/** @public */
export const neutralFillStealthRestDelta = createDelta(neutralFillStealthName, "rest", 0);

/** @public */
export const neutralFillStealthHoverDelta = createDelta(neutralFillStealthName, "hover", 3);

/** @public */
export const neutralFillStealthActiveDelta = createDelta(neutralFillStealthName, "active", 2);

/** @public */
export const neutralFillStealthFocusDelta = createDelta(neutralFillStealthName, "focus", 0);

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
export const neutralFillStealthRest = createStateToken(neutralFillStealthSet, "rest");

/** @public */
export const neutralFillStealthHover = createStateToken(neutralFillStealthSet, "hover");

/** @public */
export const neutralFillStealthActive = createStateToken(neutralFillStealthSet, "active");

/** @public */
export const neutralFillStealthFocus = createStateToken(neutralFillStealthSet, "focus");

// Neutral Fill Perceivable (previously "Strong")

const neutralFillPerceivableName = "neutral-fill-perceivable";

/** @public */
export const neutralFillPerceivableMinContrast = createMinContrast(neutralFillPerceivableName, minContrastPerceivable);

/** @public */
export const neutralFillPerceivableRestDelta = createDelta(neutralFillPerceivableName, "rest", 0);

/** @public */
export const neutralFillPerceivableHoverDelta = createDelta(neutralFillPerceivableName, "hover", 8);

/** @public */
export const neutralFillPerceivableActiveDelta = createDelta(neutralFillPerceivableName, "active", -5);

/** @public */
export const neutralFillPerceivableFocusDelta = createDelta(neutralFillPerceivableName, "focus", 0);

/** @public */
export const neutralFillPerceivableRecipe = createRecipeInteractive(neutralFillPerceivableName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillPerceivableMinContrast),
                resolve(neutralFillPerceivableRestDelta),
                resolve(neutralFillPerceivableHoverDelta),
                resolve(neutralFillPerceivableActiveDelta),
                resolve(neutralFillPerceivableFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillPerceivableSet = createSet(neutralFillPerceivableRecipe);

/** @public */
export const neutralFillPerceivableRest = createStateToken(neutralFillPerceivableSet, "rest");

/** @public */
export const neutralFillPerceivableHover = createStateToken(neutralFillPerceivableSet, "hover");

/** @public */
export const neutralFillPerceivableActive = createStateToken(neutralFillPerceivableSet, "active");

/** @public */
export const neutralFillPerceivableFocus = createStateToken(neutralFillPerceivableSet, "focus");

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongMinContrast = neutralFillPerceivableMinContrast;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongRestDelta = neutralFillPerceivableRestDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongHoverDelta = neutralFillPerceivableHoverDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongActiveDelta = neutralFillPerceivableActiveDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongFocusDelta = neutralFillPerceivableFocusDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongRecipe = neutralFillPerceivableRecipe;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongRest = neutralFillPerceivableRest;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongHover = neutralFillPerceivableHover;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongActive = neutralFillPerceivableActive;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralFillStrongFocus = neutralFillPerceivableFocus;

// Neutral Stroke Subtle (previously just "Neutral Stroke")

const neutralStrokeSubtleName = "neutral-stroke-subtle";

/** @public */
export const neutralStrokeSubtleRestDelta = createDelta(neutralStrokeSubtleName, "rest", 8);

/** @public */
export const neutralStrokeSubtleHoverDelta = createDelta(neutralStrokeSubtleName, "hover", 12);

/** @public */
export const neutralStrokeSubtleActiveDelta = createDelta(neutralStrokeSubtleName, "active", 6);

/** @public */
export const neutralStrokeSubtleFocusDelta = createDelta(neutralStrokeSubtleName, "focus", 8);

/** @public */
export const neutralStrokeSubtleRecipe = createRecipeInteractive(neutralStrokeSubtleName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
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
export const neutralStrokeSubtleRest = createStateToken(neutralStrokeSubtleSet, "rest");

/** @public */
export const neutralStrokeSubtleHover = createStateToken(neutralStrokeSubtleSet, "hover");

/** @public */
export const neutralStrokeSubtleActive = createStateToken(neutralStrokeSubtleSet, "active");

/** @public */
export const neutralStrokeSubtleFocus = createStateToken(neutralStrokeSubtleSet, "focus");

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

// Neutral Stroke Perceivable (previously "Strong")

const neutralStrokePerceivableName = "neutral-stroke-perceivable";

/** @public */
export const neutralStrokePerceivableMinContrast = createMinContrast(neutralStrokePerceivableName, minContrastPerceivable);

/** @public */
export const neutralStrokePerceivableRestDelta = createDelta(neutralStrokePerceivableName, "rest", 0);

/** @public */
export const neutralStrokePerceivableHoverDelta = createDelta(neutralStrokePerceivableName, "hover", 8);

/** @public */
export const neutralStrokePerceivableActiveDelta = createDelta(neutralStrokePerceivableName, "active", -4);

/** @public */
export const neutralStrokePerceivableFocusDelta = createDelta(neutralStrokePerceivableName, "focus", 0);

/** @public */
export const neutralStrokePerceivableRecipe = createRecipeInteractive(neutralStrokePerceivableName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokePerceivableMinContrast),
                resolve(neutralStrokePerceivableRestDelta),
                resolve(neutralStrokePerceivableHoverDelta),
                resolve(neutralStrokePerceivableActiveDelta),
                resolve(neutralStrokePerceivableFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokePerceivableSet = createSet(neutralStrokePerceivableRecipe);

/** @public */
export const neutralStrokePerceivableRest = createStateToken(neutralStrokePerceivableSet, "rest");

/** @public */
export const neutralStrokePerceivableHover = createStateToken(neutralStrokePerceivableSet, "hover");

/** @public */
export const neutralStrokePerceivableActive = createStateToken(neutralStrokePerceivableSet, "active");

/** @public */
export const neutralStrokePerceivableFocus = createStateToken(neutralStrokePerceivableSet, "focus");

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongMinContrast = neutralStrokePerceivableMinContrast;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongRestDelta = neutralStrokePerceivableRestDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongHoverDelta = neutralStrokePerceivableHoverDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongActiveDelta = neutralStrokePerceivableActiveDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongFocusDelta = neutralStrokePerceivableFocusDelta;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongRecipe = neutralStrokePerceivableRecipe;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongRest = neutralStrokePerceivableRest;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongHover = neutralStrokePerceivableHover;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongActive = neutralStrokePerceivableActive;

/** @public @deprecated Use "Perceivable instead of "Strong" */
export const neutralStrokeStrongFocus = neutralStrokePerceivableFocus;

// Focus Stroke Outer

const focusStrokeOuterName = "focus-stroke-outer";

/** @public */
export const focusStrokeOuterRecipe = createRecipe(focusStrokeOuterName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), resolve(minContrastReadable), true)
);

/** @public */
export const focusStrokeOuter = createRecipeToken(focusStrokeOuterRecipe);

// Focus Stroke Inner

const focusStrokeInnerName = "focus-stroke-inner";

/** @public */
export const focusStrokeInnerRecipe = createRecipe(focusStrokeInnerName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), resolve(minContrastReadable), false)
);

/** @public */
export const focusStrokeInner = createRecipeToken(focusStrokeInnerRecipe);
