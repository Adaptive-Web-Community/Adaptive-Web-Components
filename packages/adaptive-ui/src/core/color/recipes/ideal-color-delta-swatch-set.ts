import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { Palette, PaletteDirection, PaletteDirectionValue, resolvePaletteDirection } from "../palette.js";
import { InteractiveColorSet } from "../recipe.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of {@link Color}s using contrast from the reference color. If the ideal color meets contrast it
 * is used for the base color, if not it's adjusted until contrast is met. Then deltas from that color are used for each state.
 *
 * This algorithm is similar to {@link contrastAndDeltaSwatchSet}, with the addition of `idealColor`. This is often preferable
 * for brand colors, like for an accent-filled Button.
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
 * @param idealColor - The color to use as the base color if it meets `minContrast` from `reference`
 * @param minContrast - The desired minimum contrast from `reference`, which determines the base color
 * @param restDelta - The rest state offset from the base color
 * @param hoverDelta - The hover state offset from the base color
 * @param activeDelta - The active state offset from the base color
 * @param focusDelta - The focus state offset from the base color
 * @param disabledDelta - The disabled state offset from the base color
 * @param disabledPalette - The Palette for the disabled color
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @returns The interactive set of Colors
 *
 * @public
 */
export function idealColorDeltaSwatchSet(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    idealColor: Color,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    disabledDelta: number,
    disabledPalette: Palette = palette,
    direction: PaletteDirection = directionByIsDark(reference)
): InteractiveColorSet {
    const dir = resolvePaletteDirection(direction);

    const referenceIndex = palette.closestIndexOf(reference);
    const idealIndex = palette.closestIndexOf(idealColor);
    const startIndex =
        idealIndex +
        (dir === PaletteDirectionValue.darker
            ? Math.min(restDelta, hoverDelta)
            : Math.max(dir * restDelta, dir * hoverDelta));
    const accessibleSwatch = palette.colorContrast(reference, minContrast, startIndex, direction);

    const accessibleIndex1 = palette.closestIndexOf(accessibleSwatch);
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

    return {
        rest: palette.get(restIndex),
        hover: palette.get(hoverIndex),
        active: palette.get(restIndex + dir * activeDelta),
        focus: palette.get(restIndex + dir * focusDelta),
        disabled: disabledPalette.get(referenceIndex + dir * disabledDelta),
    };
}
