import { DesignTokenResolver } from "@microsoft/fast-foundation";
import type { CSSDesignToken, DesignToken, ValuesOf } from "@microsoft/fast-foundation";
import { blackOrWhiteByContrast, interactiveSwatchSetAsOverlay, swatchAsOverlay } from "../color/index.js";
import { ColorRecipe, InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { contrastAndDeltaSwatchSet } from "../color/recipes/contrast-and-delta-swatch-set.js";
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
export const fillColor = create<Swatch>("fill-color").withDefault(_white);

/** @public */
export const neutralAsOverlay = createNonCss<boolean>("neutral-as-overlay").withDefault(false);

// Accent Fill Readable (previously just "Accent Fill")

const accentFillReadableName = "accent-fill-readable";

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
            resolve(minContrastReadable),
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

// Foreground On Accent Fill Readable (previously just "Foreground On Accent")

const foregroundOnAccentFillReadableName = "foreground-on-accent-fill-readable";

/** @public */
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

/** @public */
export const foregroundOnAccentFillReadableRest = createStateToken(foregroundOnAccentFillReadableSet, "rest");

/** @public */
export const foregroundOnAccentFillReadableHover = createStateToken(foregroundOnAccentFillReadableSet, "hover");

/** @public */
export const foregroundOnAccentFillReadableActive = createStateToken(foregroundOnAccentFillReadableSet, "active");

/** @public */
export const foregroundOnAccentFillReadableFocus = createStateToken(foregroundOnAccentFillReadableSet, "focus");

// Accent Stroke Readable (previously "Foreground")

const accentStrokeReadableName = "accent-stroke-readable";

/** @public */
export const accentStrokeReadableRestDelta = createDelta(accentStrokeReadableName, "rest", 0);

/** @public */
export const accentStrokeReadableHoverDelta = createDelta(accentStrokeReadableName, "hover", 6);

/** @public */
export const accentStrokeReadableActiveDelta = createDelta(accentStrokeReadableName, "active", -8);

/** @public */
export const accentStrokeReadableFocusDelta = createDelta(accentStrokeReadableName, "focus", 0);

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
export const accentStrokeReadableRest = createStateToken(accentStrokeReadableSet, "rest");

/** @public */
export const accentStrokeReadableHover = createStateToken(accentStrokeReadableSet, "hover");

/** @public */
export const accentStrokeReadableActive = createStateToken(accentStrokeReadableSet, "active");

/** @public */
export const accentStrokeReadableFocus = createStateToken(accentStrokeReadableSet, "focus");

// Neutral Stroke Strong (previously "Foreground")

const neutralStrokeStrongName = "neutral-stroke-strong";

/** @public */
export const neutralStrokeStrongMinContrast = createMinContrast(neutralStrokeStrongName, 12);

/** @public */
export const neutralStrokeStrongRestDelta = createDelta(neutralStrokeStrongName, "rest", 0);

/** @public */
export const neutralStrokeStrongHoverDelta = createDelta(neutralStrokeStrongName, "hover", 10);

/** @public */
export const neutralStrokeStrongActiveDelta = createDelta(neutralStrokeStrongName, "active", -10);

/** @public */
export const neutralStrokeStrongFocusDelta = createDelta(neutralStrokeStrongName, "focus", 0);

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
export const neutralStrokeStrongRest = createStateToken(neutralStrokeStrongSet, "rest");

/** @public */
export const neutralStrokeStrongHover = createStateToken(neutralStrokeStrongSet, "hover");

/** @public */
export const neutralStrokeStrongActive = createStateToken(neutralStrokeStrongSet, "active");

/** @public */
export const neutralStrokeStrongFocus = createStateToken(neutralStrokeStrongSet, "focus");

// Neutral Stroke Readable (previously "Foreground Hint")

const neutralStrokeReadableName = "neutral-stroke-readable";

/** @public */
export const neutralStrokeReadableRestDelta = createDelta(neutralStrokeReadableName, "rest", 0);

/** @public */
export const neutralStrokeReadableHoverDelta = createDelta(neutralStrokeReadableName, "hover", 8);

/** @public */
export const neutralStrokeReadableActiveDelta = createDelta(neutralStrokeReadableName, "active", -4);

/** @public */
export const neutralStrokeReadableFocusDelta = createDelta(neutralStrokeReadableName, "focus", 0);

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
export const neutralStrokeReadableRest = createStateToken(neutralStrokeReadableSet, "rest")

/** @public */
export const neutralStrokeReadableHover = createStateToken(neutralStrokeReadableSet, "rest")

/** @public */
export const neutralStrokeReadableActive = createStateToken(neutralStrokeReadableSet, "rest")

/** @public */
export const neutralStrokeReadableFocus = createStateToken(neutralStrokeReadableSet, "rest")

// Neutral Fill Subtle (previously just "Neutral Fill")

const neutralFillSubtleName = "neutral-fill-subtle";

/** @public */
export const neutralFillSubtleRestDelta = createDelta(neutralFillSubtleName, "rest", 2);

/** @public */
export const neutralFillSubtleHoverDelta = createDelta(neutralFillSubtleName, "hover", 1);

/** @public */
export const neutralFillSubtleActiveDelta = createDelta(neutralFillSubtleName, "active", 0);

/** @public */
export const neutralFillSubtleFocusDelta = createDelta(neutralFillSubtleName, "focus", 2);

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

// Neutral Fill Discernible (previously "Strong")

const neutralFillDiscernibleName = "neutral-fill-discernible";

/** @public */
export const neutralFillDiscernibleRestDelta = createDelta(neutralFillDiscernibleName, "rest", 0);

/** @public */
export const neutralFillDiscernibleHoverDelta = createDelta(neutralFillDiscernibleName, "hover", 8);

/** @public */
export const neutralFillDiscernibleActiveDelta = createDelta(neutralFillDiscernibleName, "active", -5);

/** @public */
export const neutralFillDiscernibleFocusDelta = createDelta(neutralFillDiscernibleName, "focus", 0);

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
export const neutralFillDiscernibleRest = createStateToken(neutralFillDiscernibleSet, "rest");

/** @public */
export const neutralFillDiscernibleHover = createStateToken(neutralFillDiscernibleSet, "hover");

/** @public */
export const neutralFillDiscernibleActive = createStateToken(neutralFillDiscernibleSet, "active");

/** @public */
export const neutralFillDiscernibleFocus = createStateToken(neutralFillDiscernibleSet, "focus");

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

// Neutral Stroke Discernible (previously "Strong")

const neutralStrokeDiscernibleName = "neutral-stroke-discernible";

/** @public */
export const neutralStrokeDiscernibleRestDelta = createDelta(neutralStrokeDiscernibleName, "rest", 0);

/** @public */
export const neutralStrokeDiscernibleHoverDelta = createDelta(neutralStrokeDiscernibleName, "hover", 8);

/** @public */
export const neutralStrokeDiscernibleActiveDelta = createDelta(neutralStrokeDiscernibleName, "active", -4);

/** @public */
export const neutralStrokeDiscernibleFocusDelta = createDelta(neutralStrokeDiscernibleName, "focus", 0);

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
export const neutralStrokeDiscernibleRest = createStateToken(neutralStrokeDiscernibleSet, "rest");

/** @public */
export const neutralStrokeDiscernibleHover = createStateToken(neutralStrokeDiscernibleSet, "hover");

/** @public */
export const neutralStrokeDiscernibleActive = createStateToken(neutralStrokeDiscernibleSet, "active");

/** @public */
export const neutralStrokeDiscernibleFocus = createStateToken(neutralStrokeDiscernibleSet, "focus");

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
