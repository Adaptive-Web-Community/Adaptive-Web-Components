import { Palette, PaletteDirection, resolvePaletteDirection } from "../palette.js";
import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch, SwatchRGB } from "../swatch.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of Swatches the specified positions away from the reference color.
 *
 * @param palette - The Palette used to find the Swatches
 * @param reference - The reference color
 * @param restDelta - The rest state offset from `reference`
 * @param hoverDelta - The hover state offset from `reference`
 * @param activeDelta - The active state offset from `reference`
 * @param focusDelta - The focus state offset from `reference`
 * @param disabledDelta - The disabled state offset from the base color
 * @param disabledPalette - The Palette for the disabled Swatch
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @param zeroAsTransparent - Treat a zero offset as transparent, defaults to true
 * @returns The interactive set of Swatches
 *
 * @public
 */
export function deltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    disabledDelta: number = restDelta,
    disabledPalette: Palette = palette,
    direction: PaletteDirection = directionByIsDark(reference),
    zeroAsTransparent: boolean = false,
): InteractiveSwatchSet {
    const referenceIndex = palette.closestIndexOf(reference);
    const dir = resolvePaletteDirection(direction);

    function getSwatch(palette: Palette, delta: number): Swatch {
        const swatch = palette.get(referenceIndex + dir * delta) as SwatchRGB;
        if (zeroAsTransparent === true && delta === 0) {
            return swatch.toTransparent();
        } else {
            return swatch;
        }
    }

    return {
        rest: getSwatch(palette, restDelta),
        hover: getSwatch(palette, hoverDelta),
        active: getSwatch(palette, activeDelta),
        focus: getSwatch(palette, focusDelta),
        disabled: getSwatch(disabledPalette, disabledDelta),
    };
}
