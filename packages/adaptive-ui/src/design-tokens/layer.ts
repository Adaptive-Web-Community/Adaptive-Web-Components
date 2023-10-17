import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../adaptive-design-tokens.js";
import { Palette, PaletteDirectionValue } from "../color/palette.js";
import { ColorRecipeParams, InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../color/recipes/index.js";
import { Swatch } from "../color/swatch.js";
import { luminanceSwatch } from "../color/utilities/luminance-swatch.js";
import { StyleProperty } from "../modules/types.js";
import { createNonCss, createTokenNonCss, createTokenSwatch } from "../token-helpers.js";
import { InteractiveTokenGroup } from "../types.js";
import { fillColor } from "./color.js";
import { neutralPalette } from "./palette.js";

/**
 * A recipe that evaluates to a "Fixed" layer treatment.
 *
 * @public
 */
export interface LayerRecipe {
    /**
     * Evaluate a "Fixed" layer treatment.
     *
     * {@link layerFillFixedRecipe}
     *
     * @param resolve - The resolver to evaluate the recipe
     * @param index - The index of the layer, `0` for "Base", plus or minus relative to "Base"
     */
    evaluate(resolve: DesignTokenResolver, index: number): Swatch;
}

/**
 * Baseline values for light and dark mode for {@link layerFillBaseLuminance}.
 *
 * @remarks
 * These values represent reasonable starting points for light and dark modes, but custom values can be used instead.
 *
 * @public
 */
export const LayerBaseLuminance = Object.freeze({
    LightMode: 0.95,
    DarkMode: 0.15,
} as const);

/**
 * The {@link Palette} to use for Layer recipes.
 *
 * @remarks
 * By default this maps to the {@link neutralPalette}.
 * Use a custom palette like `layerPalette.withDefault(PaletteRGB.from("#[HEX_COLOR]"))`.
 *
 * @public
 */
export const layerPalette = createNonCss<Palette>("layer-palette").withDefault(neutralPalette);

/**
 * The ideal luminance value for the "Base" layer, {@link layerFillFixedBase}.
 *
 * @remarks
 * 0...1, 0 = black, 1 = white.
 *
 * @public
 */
export const layerFillBaseLuminance = createTokenNonCss<number>("layer-fill-base-luminance", DesignTokenType.number).withDefault(LayerBaseLuminance.LightMode);

/**
 * The offset between "Fixed" layers, or from the container for "Interactive" rest state, {@link layerFillInteractiveRest}.
 *
 * @remarks
 * A negative value causes "Minus" recipes to go darker and "Plus" recipes to go lighter. A positive value causes the reverse.
 *
 * @public
 */
export const layerFillDelta = createTokenNonCss<number>("layer-fill-delta", DesignTokenType.number).withDefault(-2);

/**
 * The offset from the container for "Interactive" hover state, {@link layerFillInteractiveHover}.
 *
 * @public
 */
export const layerFillHoverDelta = createTokenNonCss<number>("layer-fill-hover-delta", DesignTokenType.number).withDefault(-3);

/**
 * The offset from the container for "Interactive" active state, {@link layerFillInteractiveActive}.
 *
 * @public
 */
export const layerFillActiveDelta = createTokenNonCss<number>("layer-fill-active-delta", DesignTokenType.number).withDefault(-1);

/**
 * The offset from the container for "Interactive" focus state, {@link layerFillInteractiveFocus}.
 *
 * @public
 */
export const layerFillFocusDelta = createTokenNonCss<number>("layer-fill-focus-delta", DesignTokenType.number).withDefault(-3);

/**
 * The offset from the container for "Interactive" disabled state, {@link layerFillInteractiveDisabled}.
 *
 * @public
 */
export const layerFillDisabledDelta = createTokenNonCss<number>("layer-fill-disabled-delta", DesignTokenType.number).withDefault(-1);

/**
 * The "Fixed" layers represent background fills commonly used to define app structure.
 *
 * @remarks
 * The primary content is {@link layerFillFixedBase}.
 * Underlying sections like navigation or header are logically *beneath* using {@link layerFillFixedMinus1}, etc.
 * Layers above the "Base" like flyouts or dialogs use {@link layerFillFixedPlus1}, etc.
 *
 * See {@link layerFillDelta}.
 *
 * @public
 */
export const layerFillFixedRecipe = createNonCss<LayerRecipe>("layer-fill-fixed-recipe").withDefault({
    evaluate: (resolve: DesignTokenResolver, index: number): Swatch =>
        deltaSwatch(
            resolve(layerPalette),
            luminanceSwatch(resolve(layerFillBaseLuminance)),
            resolve(layerFillDelta) * index,
            PaletteDirectionValue.darker
        ),
});

/**
 * The fill of the "Base" or primary content layer.
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedBase = createTokenSwatch("layer-fill-fixed-base", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 0)
);

/**
 * The fill of the layer 1 level beneath "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedMinus1 = createTokenSwatch("layer-fill-fixed-minus-1", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, -1)
);

/**
 * The fill of the layer 2 levels beneath "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedMinus2 = createTokenSwatch("layer-fill-fixed-minus-2", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, -2)
);

/**
 * The fill of the layer 3 levels beneath "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedMinus3 = createTokenSwatch("layer-fill-fixed-minus-3", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, -3)
);

/**
 * The fill of the layer 4 levels beneath "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedMinus4 = createTokenSwatch("layer-fill-fixed-minus-4", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, -4)
);

/**
 * The fill of the layer 1 level above "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedPlus1 = createTokenSwatch("layer-fill-fixed-plus-1", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 1)
);

/**
 * The fill of the layer 2 levels above "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedPlus2 = createTokenSwatch("layer-fill-fixed-plus-2", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 2)
);

/**
 * The fill of the layer 3 levels above "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedPlus3 = createTokenSwatch("layer-fill-fixed-plus-3", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 3)
);

/**
 * The fill of the layer 4 levels above "Base".
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedPlus4 = createTokenSwatch("layer-fill-fixed-plus-4", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 4)
);

/**
 * The recipe for a layer relative to its context (as opposed to {@link layerFillBaseLuminance}).
 *
 * @remarks
 * Useful for a `Card` or other container that's interactive.
 *
 * @public
 */
export const layerFillInteractiveRecipe = createNonCss<InteractiveColorRecipe>("layer-fill-interactive-recipe").withDefault({
    evaluate: (resolve: DesignTokenResolver, params?: ColorRecipeParams): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(layerPalette),
            params?.reference || resolve(fillColor),
            resolve(layerFillDelta),
            resolve(layerFillHoverDelta),
            resolve(layerFillActiveDelta),
            resolve(layerFillFocusDelta),
            resolve(layerFillDisabledDelta),
            undefined,
            PaletteDirectionValue.darker,
        ),
});

/**
 * The fill of an interactive layer at rest.
 *
 * @remarks
 * See {@link layerFillDelta}.
 *
 * @public
 */
export const layerFillInteractiveRest = createTokenSwatch("layer-fill-interactive-rest", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).rest
);

/**
 * The fill of an interactive layer while hovered.
 *
 * @remarks
 * See {@link layerFillHoverDelta}.
 *
 * @public
 */
export const layerFillInteractiveHover = createTokenSwatch("layer-fill-interactive-hover", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).hover
);

/**
 * The fill of an interactive layer while pressed.
 *
 * @remarks
 * See {@link layerFillActiveDelta}.
 *
 * @public
 */
export const layerFillInteractiveActive = createTokenSwatch("layer-fill-interactive-active", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).active
);

/**
 * The fill of an interactive layer while focused.
 *
 * @remarks
 * See {@link layerFillFocusDelta}.
 *
 * @public
 */
export const layerFillInteractiveFocus = createTokenSwatch("layer-fill-interactive-focus", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).focus
);

/**
 * The fill of an interactive layer while disabled.
 *
 * @remarks
 * See {@link layerFillDisabledDelta}.
 *
 * @public
 */
export const layerFillInteractiveDisabled = createTokenSwatch("layer-fill-interactive-disabled", StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).disabled
);

/** @public */
export const layerFillInteractive: InteractiveTokenGroup<Swatch> = {
    name: "layer-fill-interactive",
    rest: layerFillInteractiveRest,
    hover: layerFillInteractiveHover,
    active: layerFillInteractiveActive,
    focus: layerFillInteractiveFocus,
    disabled: layerFillInteractiveDisabled,
};
