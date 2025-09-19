import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { DesignTokenType } from "../core/adaptive-design-tokens.js";
import { Palette, PaletteDirectionValue } from "../core/color/palette.js";
import { ColorRecipeParams, InteractivePaintSet } from "../core/color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../core/color/recipes/index.js";
import { Color } from "../core/color/color.js";
import { luminanceSwatch } from "../core/color/utilities/luminance-swatch.js";
import { StyleProperty } from "../core/modules/types.js";
import { createTokenColor, createTokenNonCss, createTokenRecipe } from "../core/token-helpers.js";
import { createTokenColorRecipe, createTokenColorSet, createTokenDelta } from "../core/token-helpers-color.js";
import { InteractiveState } from "../core/types.js";
import { colorContext } from "./color.js";
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
export const layerPalette = createTokenNonCss<Palette>("color.layer.palette", DesignTokenType.palette).withDefault(neutralPalette);

const layerFillName = "color.layer.fill";

/**
 * The offset between "Fixed" layers, or from the container for "Interactive" rest state, {@link layerFillInteractiveRest}.
 *
 * @remarks
 * A negative value causes "Minus" recipes to go darker and "Plus" recipes to go lighter. A positive value causes the reverse.
 *
 * @public
 */
export const layerFillRestDelta = createTokenDelta(layerFillName, "layer", -2);

/**
 * @public
 * @deprecated Use `layerFillLayerDelta` instead.
 */
export const layerFillDelta = layerFillRestDelta;

const layerFillFixedName = `${layerFillName}.ramp`;

/**
 * The ideal luminance value for the "Base" layer, {@link layerFillFixedBase}.
 *
 * @remarks
 * 0...1, 0 = black, 1 = white.
 *
 * @public
 */
export const layerFillBaseLuminance = createTokenNonCss<number>(`${layerFillFixedName}.baseLuminance`, DesignTokenType.number).withDefault(LayerBaseLuminance.LightMode);

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
export const layerFillFixedRecipe = createTokenRecipe<number, Color>(
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
export const layerFillFixedBase = createTokenColor(`${layerFillFixedName}.base`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus1 = createTokenColor(`${layerFillFixedName}.minus1`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus2 = createTokenColor(`${layerFillFixedName}.minus2`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus3 = createTokenColor(`${layerFillFixedName}.minus3`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedMinus4 = createTokenColor(`${layerFillFixedName}.minus4`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus1 = createTokenColor(`${layerFillFixedName}.plus1`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus2 = createTokenColor(`${layerFillFixedName}.plus2`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus3 = createTokenColor(`${layerFillFixedName}.plus3`, StyleProperty.backgroundFill).withDefault(
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
export const layerFillFixedPlus4 = createTokenColor(`${layerFillFixedName}.plus4`, StyleProperty.backgroundFill).withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillFixedRecipe).evaluate(resolve, 4)
);

const layerFillInteractiveName = `${layerFillName}.interactive`;

/**
 * The offset from the container for "Interactive" hover state, {@link layerFillInteractiveHover}.
 *
 * @public
 */
export const layerFillHoverDelta = createTokenDelta(layerFillInteractiveName, InteractiveState.hover, -3);

/**
 * The offset from the container for "Interactive" active state, {@link layerFillInteractiveActive}.
 *
 * @public
 */
export const layerFillActiveDelta = createTokenDelta(layerFillInteractiveName, InteractiveState.active, -1);

/**
 * The offset from the container for "Interactive" focus state, {@link layerFillInteractiveFocus}.
 *
 * @public
 */
export const layerFillFocusDelta = createTokenDelta(layerFillInteractiveName, InteractiveState.focus, -3);

/**
 * The offset from the container for "Interactive" disabled state, {@link layerFillInteractiveDisabled}.
 *
 * @public
 */
export const layerFillDisabledDelta = createTokenDelta(layerFillInteractiveName, InteractiveState.disabled, -1);

/**
 * The recipe for a layer relative to its context (as opposed to {@link layerFillBaseLuminance}).
 *
 * @remarks
 * Useful for a `Card` or other container that's interactive.
 *
 * @public
 */
export const layerFillInteractiveRecipe = createTokenColorRecipe<InteractivePaintSet>(layerFillInteractiveName, StyleProperty.backgroundFill,
    (resolve: DesignTokenResolver, params?: ColorRecipeParams): InteractivePaintSet =>
        deltaSwatchSet(
            resolve(layerPalette),
            params?.reference || resolve(colorContext),
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
