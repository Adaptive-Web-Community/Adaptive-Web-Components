import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { closestSwatchIndex, Palette, PaletteDirection, reversedSwatches } from "../palette.js";
import { binarySearch } from "../utilities/binary-search.js";
import { directionByIsDark } from "../utilities/direction-by-is-dark.js";
import { contrast } from "../utilities/relative-luminance.js";

/**
 * Gets the color from a palette that most closely meets the `minContrast` ratio for the `reference`.
 *
 * @param palette - The palette
 * @param reference - The color or gradient to get contrast against
 * @param minContrast - The minimum amount of contrast from the `reference`
 * @param direction - Optional direction of the search, away from the `reference` by default
 * @param startIndex - Optional starting point for the search, the index closest to the `reference` by default
 * @returns The color that meets the provided contrast
 *
 * @public
 */
export function contrastColor(
    palette: Palette,
    reference: Paint,
    minContrast: number,
    direction: PaletteDirection = directionByIsDark(reference),
    startIndex: number = closestSwatchIndex(palette, reference)
): Color {
    const endIndex = palette.swatches.length - 1;
    const condition = (value: Color) => contrast(reference, value) >= minContrast;

    if (direction === PaletteDirection.lighter) {
        return binarySearch(reversedSwatches(palette), condition, endIndex - startIndex, endIndex);
    }

    return binarySearch(palette.swatches, condition, startIndex, endIndex);
}
