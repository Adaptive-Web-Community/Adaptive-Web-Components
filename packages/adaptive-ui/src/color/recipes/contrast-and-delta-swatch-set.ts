import { Palette, PaletteDirection, PaletteDirectionValue, resolvePaletteDirection } from "../palette.js";
import { InteractiveSwatchSet } from "../recipe.js";
import { Swatch, SwatchRGB } from "../swatch.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";

/**
 * Gets an interactive set of {@link Swatch}es using contrast from the reference color, then deltas for each state.
 *
 * Since this is based on contrast it tries to do the right thing for accessibility. Ideally the `restDelta`
 * and `hoverDelta` should be greater than or equal to zero, because that will ensure those colors meet or
 * exceed the `minContrast`.
 *
 * This algorithm will maintain the difference between the rest and hover deltas, but may slide them on the Palette
 * to maintain accessibility.
 *
 * @param palette - The Palette used to find the Swatches
 * @param reference - The reference color
 * @param minContrast - The desired minimum contrast from `reference`, which determines the base color
 * @param restDelta - The rest state offset from the base color
 * @param hoverDelta - The hover state offset from the base color
 * @param activeDelta - The active state offset from the base color
 * @param focusDelta - The focus state offset from the base color
 * @param direction - The direction the deltas move on the `palette`, defaults to {@link directionByIsDark} based on `reference`
 * @param zeroAsTransparent - Treat a zero offset as transparent, defaults to true
 * @returns The interactive set of Swatches
 *
 * @public
 */
export function contrastAndDeltaSwatchSet(
    palette: Palette,
    reference: Swatch,
    minContrast: number,
    restDelta: number,
    hoverDelta: number,
    activeDelta: number,
    focusDelta: number,
    direction: PaletteDirection = directionByIsDark(reference),
    zeroAsTransparent: boolean = true,
): InteractiveSwatchSet {
    const dir = resolvePaletteDirection(direction);

    const referenceIndex = palette.closestIndexOf(reference);
    const accessibleSwatch = palette.colorContrast(reference, minContrast, referenceIndex);

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

    function getSwatch(index: number): Swatch {
        const swatch = palette.get(index) as SwatchRGB;
        if (zeroAsTransparent === true && index === referenceIndex) {
            return swatch.toTransparent();
        } else {
            return swatch;
        }
    }

    return {
        rest: getSwatch(restIndex),
        hover: getSwatch(hoverIndex),
        active: getSwatch(restIndex + dir * activeDelta),
        focus: getSwatch(restIndex + dir * focusDelta),
    };
}
