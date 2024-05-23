import { Rgb } from "culori/fn/index.js";

/**
 * Gets a string representation of `isTrue` based on the format of `booleanFormat`.
 *
 * @remarks
 * Figma supports component properties like "true", "True", "yes", and "Yes", but doesn't do the work to interpret it.
 *
 * Assumes the value is paired with the same case and set (i.e. "Yes" / "No", "true" / "false", etc.).
 * 
 * @param booleanFormat - String representation of a boolean value like "Yes" or "false"
 * @param isTrue - The actual boolean value to convert to the appropriate string
 */
export const variantBooleanHelper = (booleanFormat: string, isTrue: boolean): string | undefined => {
    const booleanPairs = [
        ["No", "Yes"],
        ["False", "True"],
    ];

    const found = booleanPairs.find(
        (pair) => pair.find(
            (bool) => bool.toLowerCase() === booleanFormat.toLowerCase()
        )
    );

    return found?.map(
        (bool) => (booleanFormat.match(/^[nytf]/) ? bool.toLowerCase() : bool)
    )[
        !isTrue ? 0 : 1
    ];
}

export const colorToRgb = (color: Rgb): RGB => {
    return {
        r: color.r,
        g: color.g,
        b: color.b,
    };
}

export const colorToRgba = (color: Rgb): RGBA => {
    return {
        r: color.r,
        g: color.g,
        b: color.b,
        a: color.alpha || 1,
    };
}
