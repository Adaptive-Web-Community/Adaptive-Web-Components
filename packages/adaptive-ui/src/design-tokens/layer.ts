import { DesignTokenResolver } from "@microsoft/fast-foundation";
import { Palette, PaletteDirectionValue } from "../color/palette.js";
import { InteractiveColorRecipe, InteractiveSwatchSet } from "../color/recipe.js";
import { deltaSwatch, deltaSwatchSet } from "../color/recipes/index.js";
import { Swatch } from "../color/swatch.js";
import { luminanceSwatch } from "../color/utilities/luminance-swatch.js";
import { fillColor } from "./color.js";
import { create, createNonCss } from "./create.js";
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
export const layerFillBaseLuminance = createNonCss<number>("layer-fill-base-luminance").withDefault(LayerBaseLuminance.LightMode);

/**
 * The offset between "Fixed" layers, or from the container for "Interactive" rest state, {@link layerFillInteractiveRest}.
 *
 * @remarks
 * A negative value causes "Minus" recipes to go darker and "Plus" recipes to go lighter. A positive value causes the reverse.
 *
 * @public
 */
export const layerFillDelta = createNonCss<number>("layer-fill-delta").withDefault(-3);

/**
 * The offset from the container for "Interactive" hover state, {@link layerFillInteractiveHover}.
 *
 * @public
 */
export const layerFillHoverDelta = createNonCss<number>("layer-fill-hover-delta").withDefault(-4);

/**
 * The offset from the container for "Interactive" active state, {@link layerFillInteractiveActive}.
 *
 * @public
 */
export const layerFillActiveDelta = createNonCss<number>("layer-fill-active-delta").withDefault(-2);

/**
 * The offset from the container for "Interactive" focus state, {@link layerFillInteractiveFocus}.
 *
 * @public
 */
export const layerFillFocusDelta = createNonCss<number>("layer-fill-focus-delta").withDefault(-3);

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
export const layerFillFixedBase = create<Swatch>("layer-fill-fixed-base").withDefault(
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
export const layerFillFixedMinus1 = create<Swatch>("layer-fill-fixed-minus-1").withDefault(
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
export const layerFillFixedMinus2 = create<Swatch>("layer-fill-fixed-minus-2").withDefault(
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
export const layerFillFixedMinus3 = create<Swatch>("layer-fill-fixed-minus-3").withDefault(
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
export const layerFillFixedMinus4 = create<Swatch>("layer-fill-fixed-minus-4").withDefault(
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
export const layerFillFixedPlus1 = create<Swatch>("layer-fill-fixed-plus-1").withDefault(
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
export const layerFillFixedPlus2 = create<Swatch>("layer-fill-fixed-plus-2").withDefault(
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
export const layerFillFixedPlus3 = create<Swatch>("layer-fill-fixed-plus-3").withDefault(
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
export const layerFillFixedPlus4 = create<Swatch>("layer-fill-fixed-plus-4").withDefault(
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
    evaluate: (resolve: DesignTokenResolver, reference?: Swatch): InteractiveSwatchSet =>
        deltaSwatchSet(
            resolve(layerPalette),
            reference || resolve(fillColor),
            resolve(layerFillDelta),
            resolve(layerFillHoverDelta),
            resolve(layerFillActiveDelta),
            resolve(layerFillFocusDelta),
            PaletteDirectionValue.darker
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
export const layerFillInteractiveRest = create<Swatch>("layer-fill-interactive-rest").withDefault(
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
export const layerFillInteractiveHover = create<Swatch>("layer-fill-interactive-hover").withDefault(
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
export const layerFillInteractiveActive = create<Swatch>("layer-fill-interactive-active").withDefault(
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
export const layerFillInteractiveFocus = create<Swatch>("layer-fill-interactive-focus").withDefault(
    (resolve: DesignTokenResolver) =>
        resolve(layerFillInteractiveRecipe).evaluate(resolve).focus
);
