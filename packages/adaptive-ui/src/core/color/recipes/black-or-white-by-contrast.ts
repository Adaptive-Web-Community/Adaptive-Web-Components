import { Color } from "../color.js";
import { Paint } from "../paint.js";
import { _black, _white } from "../utilities/color-constants.js";

/**
 * Gets a black or white Color based on the reference color and minimum contrast.
 *
 * @remarks
 * If neither black nor white meet the requested contrast the highest contrasting color is returned.
 *
 * @param reference - The reference color
 * @param minContrast - The minimum contrast required for black or white from `reference`
 * @param defaultBlack - True to default to black if both black and white meet contrast
 * @returns A black or white Color
 *
 * @public
 */
export function blackOrWhiteByContrast(reference: Paint, minContrast: number, defaultBlack: boolean): Color {
    const defaultColor = defaultBlack ? _black : _white;
    const otherColor = defaultBlack ? _white : _black;
    const defaultContrast = reference.contrast(defaultColor);
    const otherContrast = reference.contrast(otherColor);
    return defaultContrast >= minContrast
        ? defaultColor
        : otherContrast >= minContrast
        ? otherColor
        : defaultContrast > otherContrast
        ? defaultColor
        : otherColor;
}
