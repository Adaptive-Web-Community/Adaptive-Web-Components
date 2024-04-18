import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../core/adaptive-design-tokens.js";
import { Palette, PaletteDirectionValue } from "../core/color/palette.js";
import { ColorRecipeParams, InteractiveSwatchSet } from "../core/color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../core/color/recipes/index.js";
import { Swatch } from "../core/color/swatch.js";
import { luminanceSwatch } from "../core/color/utilities/luminance-swatch.js";
import { StyleProperty } from "../core/modules/types.js";
import { createTokenNonCss, createTokenRecipe, createTokenSwatch } from "../core/token-helpers.js";
import { createTokenColorRecipe, createTokenColorSet, createTokenDelta } from "../core/token-helpers-color.js";
import { InteractiveState } from "../core/types.js";
import { fillColor } from "./color.js";
import { neutralPalette } from "./palette.js";

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
export const layerPalette = createTokenNonCss<Palette>("layer-palette", DesignTokenType.palette).withDefault(neutralPalette);

const layerFillName = "layer-fill";

/**
 * The ideal luminance value for the "Base" layer, {@link layerFillFixedBase}.
 *
 * @remarks
 * 0...1, 0 = black, 1 = white.
 *
 * @public
 */
export const layerFillBaseLuminance = createTokenNonCss<number>(`${layerFillName}-base-luminance`, DesignTokenType.number).withDefault(LayerBaseLuminance.LightMode);

/**
 * The offset between "Fixed" layers, or from the container for "Interactive" rest state, {@link layerFillInteractiveRest}.
 *
 * @remarks
 * A negative value causes "Minus" recipes to go darker and "Plus" recipes to go lighter. A positive value causes the reverse.
 *
 * @public
 */
export const layerFillRestDelta = createTokenDelta(layerFillName, InteractiveState.rest, -2);

/**
 * @public
 * @deprecated Use `layerFillRestDelta` instead.
 */
export const layerFillDelta = layerFillRestDelta;

/**
 * The offset from the container for "Interactive" hover state, {@link layerFillInteractiveHover}.
 *
 * @public
 */
export const layerFillHoverDelta = createTokenDelta(layerFillName, InteractiveState.hover, -3);

/**
 * The offset from the container for "Interactive" active state, {@link layerFillInteractiveActive}.
 *
 * @public
 */
export const layerFillActiveDelta = createTokenDelta(layerFillName, InteractiveState.active, -1);

/**
 * The offset from the container for "Interactive" focus state, {@link layerFillInteractiveFocus}.
 *
 * @public
 */
export const layerFillFocusDelta = createTokenDelta(layerFillName, InteractiveState.focus, -3);

/**
 * The offset from the container for "Interactive" disabled state, {@link layerFillInteractiveDisabled}.
 *
 * @public
 */
export const layerFillDisabledDelta = createTokenDelta(layerFillName, InteractiveState.disabled, -1);

const layerFillFixedName = `${layerFillName}-fixed`;

/**
 * The "Fixed" layers represent background fills commonly used to define app structure.
 *
 * @remarks
 * The primary content is {@link layerFillFixedBase}.
 * Underlying sections like navigation or header are logically *beneath* using {@link layerFillFixedMinus1}, etc.
 * Layers above the "Base" like flyouts or dialogs use {@link layerFillFixedPlus1}, etc.
 *
 * See {@link layerFillRestDelta}.
 *
 * @public
 */
export const layerFillFixedRecipe = createTokenRecipe<number, Swatch>(
    layerFillFixedName,
    StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, index: number) =>
        deltaSwatch(
            resolve(layerPalette),
            luminanceSwatch(resolve(layerFillBaseLuminance)),
            resolve(layerFillRestDelta) * index,
            PaletteDirectionValue.darker
        ),
);

/**
 * The fill of the "Base" or primary content layer.
 *
 * @remarks
 * See {@link layerFillFixedRecipe}.
 *
 * @public
 */
export const layerFillFixedBase = createTokenSwatch(`${layerFillFixedName}-base`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus1 = createTokenSwatch(`${layerFillFixedName}-minus-1`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus2 = createTokenSwatch(`${layerFillFixedName}-minus-2`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus3 = createTokenSwatch(`${layerFillFixedName}-minus-3`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus4 = createTokenSwatch(`${layerFillFixedName}-minus-4`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus1 = createTokenSwatch(`${layerFillFixedName}-plus-1`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus2 = createTokenSwatch(`${layerFillFixedName}-plus-2`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus3 = createTokenSwatch(`${layerFillFixedName}-plus-3`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus4 = createTokenSwatch(`${layerFillFixedName}-plus-4`, StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 4)
);

const layerFillInteractiveName = `${layerFillName}-interactive`;

/**
 * The recipe for a layer relative to its context (as opposed to {@link layerFillBaseLuminance}).
 *
 * @remarks
 * Useful for a `Card` or other container that's interactive.
 *
 * @public
 */
export const layerFillInteractiveRecipe = createTokenColorRecipe<InteractiveSwatchSet>(layerFillInteractiveName, StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(layerPalette),
            params?.reference || resolve(fillColor),
            resolve(layerFillRestDelta),
            resolve(layerFillHoverDelta),
            resolve(layerFillActiveDelta),
            resolve(layerFillFocusDelta),
            resolve(layerFillDisabledDelta),
            undefined,
            PaletteDirectionValue.darker,
        ),
);

export const layerFillInteractive = createTokenColorSet(layerFillInteractiveRecipe);

/**
 * The fill of an interactive layer at rest.
 *
 * @remarks
 * See {@link layerFillRestDelta}.
 *
 * @public
 */
export const layerFillInteractiveRest = layerFillInteractive.rest;

/**
 * The fill of an interactive layer while hovered.
 *
 * @remarks
 * See {@link layerFillHoverDelta}.
 *
 * @public
 */
export const layerFillInteractiveHover = layerFillInteractive.hover;

/**
 * The fill of an interactive layer while pressed.
 *
 * @remarks
 * See {@link layerFillActiveDelta}.
 *
 * @public
 */
export const layerFillInteractiveActive = layerFillInteractive.active;

/**
 * The fill of an interactive layer while focused.
 *
 * @remarks
 * See {@link layerFillFocusDelta}.
 *
 * @public
 */
export const layerFillInteractiveFocus = layerFillInteractive.focus;

/**
 * The fill of an interactive layer while disabled.
 *
 * @remarks
 * See {@link layerFillDisabledDelta}.
 *
 * @public
 */
export const layerFillInteractiveDisabled = layerFillInteractive.disabled;
