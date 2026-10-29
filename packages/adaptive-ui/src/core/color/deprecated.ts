/**
 * The names and signatures of what Adaptive UI had before, for the beta of 1.0 to be an easier step from 0.14.
 *
 * @remarks
 * Everything here is deprecated and will be removed before 1.0. See MIGRATION.md for what to use, and for what has
 * no replacement because it was an instance method of a class, or a token. Why: `docs/decisions/0002-deprecated-names-for-the-beta.md`.
 */
import { Color as ColorValue, isTransparent, parseColor, rgbColor, withAlpha } from "./color.js";
import type { ConicGradient as ConicGradientValue, LinearGradient as LinearGradientValue, RadialGradient as RadialGradientValue } from "./gradient.js";
import { conicGradient, GradientStop, linearGradient, radialGradient } from "./gradient.js";
import { InteractiveColorSet } from "./interactive-set.js";
import { createPaletteOkhsl } from "./palette-okhsl.js";
import { Palette, PaletteDirection } from "./palette.js";
import { Paint } from "./paint.js";
import { contrastAndDeltaColorSet } from "./recipes/contrast-and-delta-color-set.js";
import { contrastColor } from "./recipes/contrast-color.js";
import { deltaColor } from "./recipes/delta-color.js";
import { deltaColorSet } from "./recipes/delta-color-set.js";
import { idealColorDeltaSet } from "./recipes/ideal-color-delta-set.js";
import { black, transparent as transparentColor, white } from "./utilities/color-constants.js";
import { conditionalColorSet } from "./utilities/conditional.js";
import { directionByIsDark } from "./utilities/direction-by-is-dark.js";
import { luminanceColor } from "./utilities/luminance-color.js";
import { asOverlay, colorAsOverlay, colorSetAsOverlay } from "./utilities/opacity.js";

type Direction = PaletteDirection | (() => PaletteDirection);

/**
 * Gets a fixed {@link (PaletteDirection:variable)} from a direction that may be a function that needs to be resolved.
 *
 * @param direction - A fixed palette direction value or a function that resolves to one
 * @returns A fixed palette direction value
 *
 * @deprecated A direction is only a value, and a function that gets one is just called.
 * @public
 */
export function resolvePaletteDirection(direction: Direction): PaletteDirection {
    return typeof direction === "function" ? direction() : direction;
}

/**
 * @deprecated Use {@link black}.
 * @public
 */
export const _black = black;

/**
 * @deprecated Use {@link white}.
 * @public
 */
export const _white = white;

/**
 * @deprecated Use {@link luminanceColor}.
 * @public
 */
export const luminanceSwatch = luminanceColor;

/**
 * @deprecated Use {@link colorAsOverlay}.
 * @public
 */
export const swatchAsOverlay = colorAsOverlay;

/**
 * @deprecated Use {@link colorSetAsOverlay}.
 * @public
 */
export const interactiveSwatchSetAsOverlay = colorSetAsOverlay;

/**
 * @deprecated Use {@link conditionalColorSet}.
 * @public
 */
export const conditionalSwatchSet = conditionalColorSet;

/**
 * @deprecated Use {@link PaletteDirection}.
 * @public
 */
export const PaletteDirectionValue = PaletteDirection;

/**
 * @deprecated Use {@link PaletteDirection}.
 * @public
 */
export type PaletteDirectionValue = PaletteDirection;

/**
 * @deprecated Use {@link deltaColor}.
 * @public
 */
export const deltaSwatch = deltaColor;

/**
 * @deprecated Use {@link contrastColor}.
 * @public
 */
export const contrastSwatch = contrastColor;

/**
 * @deprecated Use {@link deltaColorSet}, which takes the deltas as an object and the rest as options.
 * @public
 */
export function deltaSwatchSet(
    palette: Palette,
    reference: Paint,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    disabledDelta: number = restDelta,
    disabledPalette: Palette = palette,
    direction: Direction = directionByIsDark(reference),
    zeroAsTransparent: boolean = false
): InteractiveColorSet {
    return deltaColorSet(
        palette,
        reference,
        { rest: restDelta, hover: hoverDelta, active: activeDelta, focus: focusDelta, disabled: disabledDelta },
        { disabledPalette, direction: resolvePaletteDirection(direction), zeroAsTransparent }
    );
}

/**
 * @deprecated Use {@link contrastAndDeltaColorSet}, which takes the deltas as an object and the rest as options.
 * @public
 */
export function contrastAndDeltaSwatchSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    disabledDelta: number,
    disabledPalette: Palette = palette,
    direction: Direction = directionByIsDark(reference),
    zeroAsTransparent: boolean = false
): InteractiveColorSet {
    return contrastAndDeltaColorSet(
        palette,
        reference,
        minContrast,
        { rest: restDelta, hover: hoverDelta, active: activeDelta, focus: focusDelta, disabled: disabledDelta },
        { disabledPalette, direction: resolvePaletteDirection(direction), zeroAsTransparent }
    );
}

/**
 * @deprecated Use {@link idealColorDeltaSet}, which takes the deltas as an object and the rest as options.
 * @public
 */
export function idealColorDeltaSwatchSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    idealColor: ColorValue,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    disabledDelta: number,
    disabledPalette: Palette = palette,
    direction: Direction = directionByIsDark(reference)
): InteractiveColorSet {
    return idealColorDeltaSet(
        palette,
        reference,
        minContrast,
        idealColor,
        { rest: restDelta, hover: hoverDelta, active: activeDelta, focus: focusDelta, disabled: disabledDelta },
        { disabledPalette, direction: resolvePaletteDirection(direction) }
    );
}

/**
 * A color, as plain data.
 *
 * @remarks
 * This is a {@link https://www.designtokens.org/tr/2025.10/color/ | DTCG color}, the type of the design token library,
 * so a color is a token value as is.
 *
 * @public
 */
export type Color = ColorValue;

/**
 * The static members of what was a class of colors, as functions of {@link Color}.
 *
 * @remarks
 * A color is plain data now, so what it had as methods is a function of the color instead: `toString()` is
 * {@link formatColor}, `relativeLuminance` is {@link relativeLuminance}, `contrast()` is {@link contrast}.
 *
 * @deprecated Use the functions, like {@link parseColor} and {@link rgbColor}.
 * @public
 */
export const Color = {
    /**
     * @deprecated Use {@link rgbColor}.
     */
    from: (obj: { r: number; g: number; b: number; alpha?: number }): ColorValue => rgbColor(obj.r, obj.g, obj.b, obj.alpha),

    /**
     * @deprecated Use {@link rgbColor}.
     */
    fromRgb: rgbColor,

    /**
     * @deprecated Use {@link parseColor}.
     */
    parse: parseColor,

    /**
     * @deprecated Use {@link transparent}.
     */
    transparent: transparentColor,

    /**
     * @deprecated Use {@link isTransparent}.
     */
    isTransparent: (color: ColorValue): boolean => isTransparent(color),

    /**
     * @deprecated Use {@link asOverlay}.
     */
    asOverlay,

    /**
     * @deprecated Use {@link withAlpha}.
     */
    unsafeOpacity: withAlpha,
};

/**
 * @deprecated Use {@link createPaletteOkhsl}.
 * @public
 */
export const PaletteOkhsl = {
    /**
     * @deprecated Use {@link createPaletteOkhsl}.
     */
    from: createPaletteOkhsl,
};

/**
 * @deprecated Use {@link Palette}.
 * @public
 */
export type PaletteOkhsl = Palette;

/**
 * Represents a conic gradient, see {@link conicGradient}.
 *
 * @public
 */
export type ConicGradient = ConicGradientValue;

/**
 * Represents a linear gradient, see {@link linearGradient}.
 *
 * @public
 */
export type LinearGradient = LinearGradientValue;

/**
 * Represents a radial gradient, see {@link radialGradient}.
 *
 * @public
 */
export type RadialGradient = RadialGradientValue;

/**
 * @deprecated Use {@link conicGradient}.
 * @public
 */
export const ConicGradient = function (stops: GradientStop[], angle?: number) {
    return conicGradient(stops, angle);
} as unknown as new (stops: GradientStop[], angle?: number) => ConicGradientValue;

/**
 * @deprecated Use {@link linearGradient}.
 * @public
 */
export const LinearGradient = function (stops: GradientStop[], angle?: number) {
    return linearGradient(stops, angle);
} as unknown as new (stops: GradientStop[], angle?: number) => LinearGradientValue;

/**
 * @deprecated Use {@link radialGradient}.
 * @public
 */
export const RadialGradient = function (stops: GradientStop[]) {
    return radialGradient(stops);
} as unknown as new (stops: GradientStop[]) => RadialGradientValue;
