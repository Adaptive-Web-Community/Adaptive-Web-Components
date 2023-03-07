import { DesignTokenResolver } from "@microsoft/fast-foundation";
import type { CSSDesignToken, DesignToken } from "@microsoft/fast-foundation";
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

function createMinContrast(name: string, value: number) {
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

/** @public */
export const fillColor = create<Swatch>("fill-color").withDefault(_white);

/** @public */
export const neutralAsOverlay = createNonCss<boolean>("neutral-as-overlay").withDefault(false);

// Accent Fill

const accentFillName = "accent-fill";

/** @public */
export const accentFillMinContrast = createMinContrast(accentFillName, 4.5);

/** @public */
export const accentFillRestDelta = createDelta(accentFillName, "rest", 0);

/** @public */
export const accentFillHoverDelta = createDelta(accentFillName, "hover", -2);

/** @public */
export const accentFillActiveDelta = createDelta(accentFillName, "active", -5);

/** @public */
export const accentFillFocusDelta = createDelta(accentFillName, "focus", 0);

/** @public */
export const accentFillRecipe = createRecipeInteractive(accentFillName,
    (resolve: DesignTokenResolver, reference?: Swatch) =>
        contrastAndDeltaSwatchSet(
            resolve(accentPalette),
            reference || resolve(fillColor),
            resolve(accentFillMinContrast),
            resolve(accentFillRestDelta),
            resolve(accentFillHoverDelta),
            resolve(accentFillActiveDelta),
            resolve(accentFillFocusDelta)
        )
);

const accentFillSet = createSet(accentFillRecipe);

/** @public */
export const accentFillRest = createStateToken(accentFillSet, "rest");

/** @public */
export const accentFillHover = createStateToken(accentFillSet, "hover");

/** @public */
export const accentFillActive = createStateToken(accentFillSet, "active");

/** @public */
export const accentFillFocus = createStateToken(accentFillSet, "focus");

// Foreground On Accent

const foregroundOnAccentName = "foreground-on-accent";

/** @public */
export const foregroundOnAccentRecipe = createRecipeInteractive(foregroundOnAccentName,
    (resolve: DesignTokenResolver): InteractiveSwatchSet =>
        blackOrWhiteByContrastSet(
            resolve(accentFillRest),
            resolve(accentFillHover),
            resolve(accentFillActive),
            resolve(accentFillFocus),
            ContrastTarget.NormalText,
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
export const accentForegroundMinContrast = createMinContrast(accentForegroundName, ContrastTarget.NormalText);

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

// Neutral Foreground Hint

const neutralForegroundHintName = "neutral-foreground-hint";

/** @public */
export const neutralForegroundHintRecipe = createRecipe(neutralForegroundHintName,
    (resolve: DesignTokenResolver, reference?: Swatch): Swatch =>
        swatchAsOverlay(
            contrastSwatch(resolve(neutralPalette), reference || resolve(fillColor), ContrastTarget.NormalText),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

/** @public */
export const neutralForegroundHint = createRecipeToken(neutralForegroundHintRecipe)

// Neutral Fill

const neutralFillName = "neutral-fill";

/** @public */
export const neutralFillRestDelta = createDelta(neutralFillName, "rest", -1);

/** @public */
export const neutralFillHoverDelta = createDelta(neutralFillName, "hover", 1);

/** @public */
export const neutralFillActiveDelta = createDelta(neutralFillName, "active", 0);

/** @public */
export const neutralFillFocusDelta = createDelta(neutralFillName, "focus", 0);

/** @public */
export const neutralFillRecipe = createRecipeInteractive(neutralFillName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillRestDelta),
                resolve(neutralFillHoverDelta),
                resolve(neutralFillActiveDelta),
                resolve(neutralFillFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillSet = createSet(neutralFillRecipe);

/** @public */
export const neutralFillRest = createStateToken(neutralFillSet, "rest");

/** @public */
export const neutralFillHover = createStateToken(neutralFillSet, "hover");

/** @public */
export const neutralFillActive = createStateToken(neutralFillSet, "active");

/** @public */
export const neutralFillFocus = createStateToken(neutralFillSet, "focus");

// Neutral Fill Input

const neutralFillInputName = "neutral-fill-input";

/** @public */
export const neutralFillInputRestDelta = createDelta(neutralFillInputName, "rest", -1);

/** @public */
export const neutralFillInputHoverDelta = createDelta(neutralFillInputName, "hover", 1);

/** @public */
export const neutralFillInputActiveDelta = createDelta(neutralFillInputName, "active", -2);

/** @public */
export const neutralFillInputFocusDelta = createDelta(neutralFillInputName, "focus", -2);

/** @public */
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

const neutralFillInputSet = createSet(neutralFillInputRecipe);

/** @public */
export const neutralFillInputRest = createStateToken(neutralFillInputSet, "rest");

/** @public */
export const neutralFillInputHover = createStateToken(neutralFillInputSet, "hover");

/** @public */
export const neutralFillInputActive = createStateToken(neutralFillInputSet, "active");

/** @public */
export const neutralFillInputFocus = createStateToken(neutralFillInputSet, "focus");

// Neutral Fill Secondary

const neutralFillSecondaryName = "neutral-fill-secondary";

/** @public */
export const neutralFillSecondaryRestDelta = createDelta(neutralFillSecondaryName, "rest", 3);

/** @public */
export const neutralFillSecondaryHoverDelta = createDelta(neutralFillSecondaryName, "hover", 2);

/** @public */
export const neutralFillSecondaryActiveDelta = createDelta(neutralFillSecondaryName, "active", 1);

/** @public */
export const neutralFillSecondaryFocusDelta = createDelta(neutralFillSecondaryName, "focus", 3);

/** @public */
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

const neutralFillSecondarySet = createSet(neutralFillSecondaryRecipe);

/** @public */
export const neutralFillSecondaryRest = createStateToken(neutralFillSecondarySet, "rest");

/** @public */
export const neutralFillSecondaryHover = createStateToken(neutralFillSecondarySet, "hover");

/** @public */
export const neutralFillSecondaryActive = createStateToken(neutralFillSecondarySet, "active");

/** @public */
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

// Neutral Fill Strong

const neutralFillStrongName = "neutral-fill-strong";

/** @public */
export const neutralFillStrongMinContrast = createMinContrast(neutralFillStrongName, 3);

/** @public */
export const neutralFillStrongRestDelta = createDelta(neutralFillStrongName, "rest", 0);

/** @public */
export const neutralFillStrongHoverDelta = createDelta(neutralFillStrongName, "hover", 8);

/** @public */
export const neutralFillStrongActiveDelta = createDelta(neutralFillStrongName, "active", -5);

/** @public */
export const neutralFillStrongFocusDelta = createDelta(neutralFillStrongName, "focus", 0);

/** @public */
export const neutralFillStrongRecipe = createRecipeInteractive(neutralFillStrongName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            contrastAndDeltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralFillStrongMinContrast),
                resolve(neutralFillStrongRestDelta),
                resolve(neutralFillStrongHoverDelta),
                resolve(neutralFillStrongActiveDelta),
                resolve(neutralFillStrongFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralFillStrongSet = createSet(neutralFillStrongRecipe);

/** @public */
export const neutralFillStrongRest = createStateToken(neutralFillStrongSet, "rest");

/** @public */
export const neutralFillStrongHover = createStateToken(neutralFillStrongSet, "hover");

/** @public */
export const neutralFillStrongActive = createStateToken(neutralFillStrongSet, "active");

/** @public */
export const neutralFillStrongFocus = createStateToken(neutralFillStrongSet, "focus");

// Neutral Stroke

const neutralStrokeName = "neutral-stroke";

/** @public */
export const neutralStrokeRestDelta = createDelta(neutralStrokeName, "rest", 8);

/** @public */
export const neutralStrokeHoverDelta = createDelta(neutralStrokeName, "hover", 12);

/** @public */
export const neutralStrokeActiveDelta = createDelta(neutralStrokeName, "active", 6);

/** @public */
export const neutralStrokeFocusDelta = createDelta(neutralStrokeName, "focus", 8);

/** @public */
export const neutralStrokeRecipe = createRecipeInteractive(neutralStrokeName,
    (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        interactiveSwatchSetAsOverlay(
            deltaSwatchSet(
                resolve(neutralPalette),
                reference || resolve(fillColor),
                resolve(neutralStrokeRestDelta),
                resolve(neutralStrokeHoverDelta),
                resolve(neutralStrokeActiveDelta),
                resolve(neutralStrokeFocusDelta)
            ),
            reference || resolve(fillColor),
            resolve(neutralAsOverlay)
        )
);

const neutralStrokeSet = createSet(neutralStrokeRecipe);

/** @public */
export const neutralStrokeRest = createStateToken(neutralStrokeSet, "rest");

/** @public */
export const neutralStrokeHover = createStateToken(neutralStrokeSet, "hover");

/** @public */
export const neutralStrokeActive = createStateToken(neutralStrokeSet, "active");

/** @public */
export const neutralStrokeFocus = createStateToken(neutralStrokeSet, "focus");

// Neutral Stroke Divider

const neutralStrokeDividerName = "neutral-stroke-divider";

/** @public */
export const neutralStrokeDividerRestDelta = createDelta(neutralStrokeDividerName, "rest", 4);

/** @public */
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

/** @public */
export const neutralStrokeDividerRest = createRecipeToken(neutralStrokeDividerRecipe);

// Neutral Stroke Input

const neutralStrokeInputName = "neutral-stroke-input";

/** @public */
export const neutralStrokeInputRestDelta = createDelta(neutralStrokeInputName, "rest", 3);

/** @public */
export const neutralStrokeInputHoverDelta = createDelta(neutralStrokeInputName, "hover", 5);

/** @public */
export const neutralStrokeInputActiveDelta = createDelta(neutralStrokeInputName, "active", 5);

/** @public */
export const neutralStrokeInputFocusDelta = createDelta(neutralStrokeInputName, "focus", 5);

/** @public */
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

const neutralStrokeInputSet = createSet(neutralStrokeInputRecipe);

/** @public */
export const neutralStrokeInputRest = createStateToken(neutralStrokeInputSet, "rest");

/** @public */
export const neutralStrokeInputHover = createStateToken(neutralStrokeInputSet, "hover");

/** @public */
export const neutralStrokeInputActive = createStateToken(neutralStrokeInputSet, "active");

/** @public */
export const neutralStrokeInputFocus = createStateToken(neutralStrokeInputSet, "focus");

// Neutral Stroke Strong

const neutralStrokeStrongName = "neutral-stroke-strong";

/** @public */
export const neutralStrokeStrongMinContrast = createMinContrast(neutralStrokeStrongName, 5.5);

/** @public */
export const neutralStrokeStrongRestDelta = createDelta(neutralStrokeStrongName, "rest", 0);

/** @public */
export const neutralStrokeStrongHoverDelta = createDelta(neutralStrokeStrongName, "hover", 0);

/** @public */
export const neutralStrokeStrongActiveDelta = createDelta(neutralStrokeStrongName, "active", 0);

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

// Focus Stroke Outer

const focusStrokeOuterName = "focus-stroke-outer";

/** @public */
export const focusStrokeOuterRecipe = createRecipe(focusStrokeOuterName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(fillColor), ContrastTarget.NormalText, true)
);

/** @public */
export const focusStrokeOuter = createRecipeToken(focusStrokeOuterRecipe);

// Focus Stroke Inner

const focusStrokeInnerName = "focus-stroke-inner";

/** @public */
export const focusStrokeInnerRecipe = createRecipe(focusStrokeInnerName,
    (resolve: DesignTokenResolver): Swatch =>
        blackOrWhiteByContrast(resolve(focusStrokeOuter), ContrastTarget.NormalText, false)
);

/** @public */
export const focusStrokeInner = createRecipeToken(focusStrokeInnerRecipe);
