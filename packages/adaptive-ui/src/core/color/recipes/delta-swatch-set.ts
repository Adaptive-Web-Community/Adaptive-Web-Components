import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection, resolvePaletteDirection } from "../palette.js";
import { InteractiveColorSet } from "../recipe.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of Colors the specified positions away from the reference color.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param restDelta - The rest state offset from `reference`
 * @param hoverDelta - The hover state offset from `reference`
 * @param activeDelta - The active state offset from `reference`
 * @param focusDelta - The focus state offset from `reference`
 * @param disabledDelta - The disabled state offset from the base color
 * @param disabledPalette - The Palette for the disabled color
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @param zeroAsTransparent - Treat a zero offset as transparent, defaults to true
 * @returns The interactive set of Colors
 *
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
    direction: PaletteDirection = directionByIsDark(reference),
    zeroAsTransparent: boolean = false,
): InteractiveColorSet {
    const referenceIndex = palette.closestIndexOf(reference);
    const dir = resolvePaletteDirection(direction);

    function getColor(palette: Palette, delta: number): Color {
        const color = palette.get(referenceIndex + dir * delta);
        if (zeroAsTransparent === true && delta === 0) {
            return Color.asOverlay(color, color);
        } else {
            return color;
        }
    }

    return {
        rest: getColor(palette, restDelta),
        hover: getColor(palette, hoverDelta),
        active: getColor(palette, activeDelta),
        focus: getColor(palette, focusDelta),
        disabled: getColor(disabledPalette, disabledDelta),
    };
}
