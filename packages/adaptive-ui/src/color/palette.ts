import { Color } from "./color.js";
import { Swatch } from "./swatch.js";
import { RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Directional values for navigating {@link Swatch}es in {@link Palette}.
 *
 * @public
 */
export const PaletteDirectionValue = Object.freeze({
    /**
     * Move darker, or up the Palette.
     */
    darker: 1,

    /**
     * Move lighter, or down the Palette.
     */
    lighter: -1,
} as const);

/**
 * Directional values for navigating {@link Swatch}es in {@link Palette}.
 *
 * @public
 */
export type PaletteDirectionValue = typeof PaletteDirectionValue[keyof typeof PaletteDirectionValue];

/**
 * Convenience type to allow a fixed {@link (PaletteDirectionValue:variable)} or a function that resolves to one.
 *
 * @public
 */
export type PaletteDirection = PaletteDirectionValue | (() => PaletteDirectionValue);

/**
 * Gets a fixed {@link (PaletteDirectionValue:variable)} from {@link PaletteDirection} which may be a function that needs to be resolved.
 *
 * @param direction - A fixed palette direction value or a function that resolves to one
 * @returns A fixed palette direction value
 *
 * @public
 */
export function resolvePaletteDirection(direction: PaletteDirection): PaletteDirectionValue {
    if (typeof direction === "function") {
        return direction();
    } else {
        return direction;
    }
}

/**
 * A collection of {@link Swatch}es that form a luminance gradient from light (index 0) to dark.
 *
 * @public
 */
export interface Palette<T extends Swatch = Swatch> {
    /**
     * The Swatch used to create the full palette.
     */
    readonly source: Color;

    /**
     * The array of all Swatches from light to dark.
     */
    readonly swatches: ReadonlyArray<T>;

    /**
     * Returns a Swatch from the Palette that most closely meets
     * the `minContrast` ratio for to the `reference`.
     *
     * @param reference - The relative luminance of the reference
     * @param minContrast - The minimum amount of contrast from the `reference`
     * @param initialIndex - Optional starting point for the search
     * @param direction - Optional control for the direction of the search
     * @returns The Swatch that meets the provided contrast
     */
    colorContrast(
        reference: RelativeLuminance,
        minContrast: number,
        initialIndex?: number,
        direction?: PaletteDirection
    ): T;

    /**
     * Returns a Swatch from the Palette that's the specified position and direction away from the `reference`.
     *
     * @param reference - The relative luminance of the reference
     * @param delta - The number of Swatches away from `reference`
     * @param direction - The direction to go from `reference`, 1 goes darker, -1 goes lighter
     */
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T;

    /**
     * Returns the index of the Palette that most closely matches
     * the provided relative luminance.
     *
     * @param reference - The relative luminance of the reference
     * @returns The index
     */
    closestIndexOf(reference: RelativeLuminance): number;

    /**
     * Gets a Swatch by index. Index is clamped to the limits
     * of the Palette so a Swatch will always be returned.
     *
     * @param index - The index
     * @returns The Swatch
     */
    get(index: number): T;
}
