import type { DesignTokenResolver } from "@microsoft/fast-foundation";
import { ColorRecipeParams, InteractiveSwatchSet } from "../color/recipe.js";
import { blackOrWhiteByContrastSet } from "../color/recipes/black-or-white-by-contrast-set.js";
import { deltaSwatchSet } from "../color/recipes/delta-swatch-set.js";
import { deltaSwatch } from "../color/recipes/delta-swatch.js";
import { Swatch } from "../color/swatch.js";
import { interactiveSwatchSetAsOverlay, swatchAsOverlay } from "../color/utilities/opacity.js";
import { StyleProperty, stylePropertyBorderFillAll } from "../modules/types.js";
import {
    createTokenColorRecipe,
    createTokenColorRecipeValue,
    createTokenColorSet,
    createTokenDelta,
    createTokenMinContrast
} from "../token-helpers-color.js";
import {
    accentFillReadableActive,
    accentFillReadableFocus,
    accentFillReadableHover,
    accentFillReadableRest,
    accentStrokeReadableActive,
    accentStrokeReadableFocus,
    accentStrokeReadableHover,
    accentStrokeReadableRest,
    fillColor,
    fillDiscernibleActiveDelta,
    fillDiscernibleFocusDelta,
    fillDiscernibleHoverDelta,
    fillDiscernibleRecipe,
    fillDiscernibleRestDelta,
    fillReadableActiveDelta,
    fillReadableFocusDelta,
    fillReadableHoverDelta,
    fillReadableRecipe,
    fillReadableRestDelta,
    fillStealthActiveDelta,
    fillStealthFocusDelta,
    fillStealthHoverDelta,
    fillStealthRestDelta,
    fillSubtleActiveDelta,
    fillSubtleFocusDelta,
    fillSubtleHoverDelta,
    fillSubtleRecipe,
    fillSubtleRestDelta,
    minContrastReadable,
    neutralAsOverlay,
    neutralFillDiscernibleActive,
    neutralFillDiscernibleFocus,
    neutralFillDiscernibleHover,
    neutralFillDiscernibleRest,
    neutralFillSubtleActive,
    neutralFillSubtleFocus,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralStrokeReadableRest,
    neutralStrokeStrongActive,
    neutralStrokeStrongFocus,
    neutralStrokeStrongHover,
    neutralStrokeStrongRest,
    neutralStrokeSubtleActive,
    neutralStrokeSubtleFocus,
    neutralStrokeSubtleHover,
    neutralStrokeSubtleRest,
    strokeDiscernibleActiveDelta,
    strokeDiscernibleFocusDelta,
    strokeDiscernibleHoverDelta,
    strokeDiscernibleRestDelta,
    strokeReadableActiveDelta,
    strokeReadableFocusDelta,
    strokeReadableHoverDelta,
    strokeReadableRecipe,
    strokeReadableRestDelta,
    strokeStrongActiveDelta,
    strokeStrongFocusDelta,
    strokeStrongHoverDelta,
    strokeStrongMinContrast,
    strokeStrongRecipe,
    strokeStrongRestDelta,
    strokeSubtleActiveDelta,
    strokeSubtleFocusDelta,
    strokeSubtleHoverDelta,
    strokeSubtleRecipe,
    strokeSubtleRestDelta
} from "../design-tokens/color.js";
import { neutralPalette } from "../design-tokens/palette.js";

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

// Foreground On Accent Fill Readable (previously just "Foreground On Accent")

const foregroundOnAccentFillReadableName = "foreground-on-accent-fill-readable";

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRecipe = createTokenColorRecipe(
    foregroundOnAccentFillReadableName,
    StyleProperty.foregroundFill,
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
export const foregroundOnAccentFillReadable = createTokenColorSet(foregroundOnAccentFillReadableRecipe);

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableRest = foregroundOnAccentFillReadable.rest;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableHover = foregroundOnAccentFillReadable.hover;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableActive = foregroundOnAccentFillReadable.active;

/** @public @deprecated This functionality has been migrated to style modules */
export const foregroundOnAccentFillReadableFocus = foregroundOnAccentFillReadable.focus;

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
export const neutralFillInputRecipe = createTokenColorRecipe(
    neutralFillInputName,
    StyleProperty.backgroundFill,
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
const neutralFillInput = createTokenColorSet(neutralFillInputRecipe);

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
export const neutralFillSecondaryRecipe = createTokenColorRecipe(
    neutralFillSecondaryName,
    StyleProperty.backgroundFill,
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
const neutralFillSecondary = createTokenColorSet(neutralFillSecondaryRecipe);

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
export const neutralStrokeDividerRecipe = createTokenColorRecipe(
    neutralStrokeDividerName,
    stylePropertyBorderFillAll,
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
export const neutralStrokeDividerRest = createTokenColorRecipeValue(neutralStrokeDividerRecipe);

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
export const neutralStrokeInputRecipe = createTokenColorRecipe(
    neutralStrokeInputName,
    stylePropertyBorderFillAll,
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
const neutralStrokeInput = createTokenColorSet(neutralStrokeInputRecipe);

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputRest = neutralStrokeInput.rest;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputHover = neutralStrokeInput.hover;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputActive = neutralStrokeInput.active;

/** @public @deprecated Use "Subtle" instead */
export const neutralStrokeInputFocus = neutralStrokeInput.focus;
