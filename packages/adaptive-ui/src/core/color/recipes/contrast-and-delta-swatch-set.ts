import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection, PaletteDirectionValue, resolvePaletteDirection } from "../palette.js";
import { InteractiveColorSet } from "../recipe.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of {@link Color}s using contrast from the reference color, then deltas for each state.
 *
 * Since this is based on contrast it tries to do the right thing for accessibility. Ideally the `restDelta`
 * and `hoverDelta` should be greater than or equal to zero, because that will ensure those colors meet or
 * exceed the `minContrast`.
 *
 * This algorithm will maintain the difference between the rest and hover deltas, but may slide them on the Palette
 * to maintain accessibility.
 *
 * @param palette - The Palette used to find the Colors
 * @param reference - The reference color
 * @param minContrast - The desired minimum contrast from `reference`, which determines the base color
 * @param restDelta - The rest state offset from the base color
 * @param hoverDelta - The hover state offset from the base color
 * @param activeDelta - The active state offset from the base color
 * @param focusDelta - The focus state offset from the base color
 * @param disabledDelta - The disabled state offset from the base color
 * @param disabledPalette - The Palette for the disabled color
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @param zeroAsTransparent - Treat a zero offset as transparent, defaults to true
 * @returns The interactive set of Colors
 *
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
    direction: PaletteDirection = directionByIsDark(reference),
    zeroAsTransparent: boolean = false,
): InteractiveColorSet {
    const dir = resolvePaletteDirection(direction);

    const referenceIndex = palette.closestIndexOf(reference);
    const accessibleColor = palette.colorContrast(reference, minContrast, referenceIndex);

    const accessibleIndex1 = palette.closestIndexOf(accessibleColor);
    const accessibleIndex2 = accessibleIndex1 + dir * Math.abs(restDelta - hoverDelta);
    const indexOneIsRestState =
        dir === PaletteDirectionValue.darker ? restDelta < hoverDelta : dir * restDelta > dir * hoverDelta;

    let restIndex: number;
    let hoverIndex: number;

    if (indexOneIsRestState) {
        restIndex = accessibleIndex1;
        hoverIndex = accessibleIndex2;
    } else {
        restIndex = accessibleIndex2;
        hoverIndex = accessibleIndex1;
    }

    function getColor(palette: Palette, index: number): Color {
        const color = palette.get(index);
        if (zeroAsTransparent === true && index === referenceIndex) {
            return Color.asOverlay(color, color);
        } else {
            return color;
        }
    }

    return {
        rest: getColor(palette, restIndex),
        hover: getColor(palette, hoverIndex),
        active: getColor(palette, restIndex + dir * activeDelta),
        focus: getColor(palette, restIndex + dir * focusDelta),
        disabled: getColor(disabledPalette, referenceIndex + dir * disabledDelta),
    };
}
