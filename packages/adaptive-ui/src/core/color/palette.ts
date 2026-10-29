import { Color } from "./color.js";
import { Paint } from "./paint.js";
import { relativeLuminance } from "./utilities/relative-luminance.js";

/**
 * Directional values for navigating the swatches in a {@link Palette}.
 *
 * @public
 */
export const PaletteDirection = Object.freeze({
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
 * Directional values for navigating the swatches in a {@link Palette}.
 *
 * @public
 */
export type PaletteDirection = typeof PaletteDirection[keyof typeof PaletteDirection];

/**
 * A collection of {@link Color}s that form a luminance gradient from light (index 0) to dark.
 *
 * @remarks
 * A palette is plain data. Use the functions in this module and the recipes to get swatches from it.
 *
 * @public
 */
export interface Palette {
    /**
     * The color used to create the full palette.
     */
    readonly source: Color;

    /**
     * The array of all colors from light to dark.
     */
    readonly swatches: ReadonlyArray<Color>;
}

/**
 * Creates a palette.
 *
 * @param source - The source color for the palette
 * @param swatches - All swatches in the palette, from light to dark
 * @returns A new palette
 *
 * @public
 */
export function createPalette(source: Color, swatches: ReadonlyArray<Color>): Palette {
    return Object.freeze({ source, swatches: Object.freeze([...swatches]) });
}

// What is derived from a palette is cached by the (immutable) palette, since a palette is plain data.
const luminances = new WeakMap<Palette, ReadonlyArray<number>>();
const reversed = new WeakMap<Palette, ReadonlyArray<Color>>();
const closestIndexCache = new WeakMap<Palette, Map<number, number>>();

/**
 * Gets the swatches of a palette in reverse order, from dark to light.
 *
 * @param palette - The palette
 * @returns The swatches, from dark to light
 *
 * @public
 */
export function reversedSwatches(palette: Palette): ReadonlyArray<Color> {
    let result = reversed.get(palette);
    if (!result) {
        result = Object.freeze([...palette.swatches].reverse());
        reversed.set(palette, result);
    }
    return result;
}

function swatchLuminances(palette: Palette): ReadonlyArray<number> {
    let result = luminances.get(palette);
    if (!result) {
        result = palette.swatches.map(relativeLuminance);
        luminances.set(palette, result);
    }
    return result;
}

/**
 * Gets a swatch by index. The index is rounded and clamped to the limits of the palette, so a color will always be
 * returned.
 *
 * @param palette - The palette
 * @param index - The index
 * @returns The color
 *
 * @public
 */
export function swatchAt(palette: Palette, index: number): Color {
    const rounded = Math.round(index);
    const last = palette.swatches.length - 1;
    return palette.swatches[isNaN(rounded) || rounded <= 0 ? 0 : rounded >= last ? last : rounded];
}

/**
 * Gets the index of the swatch that most closely matches the relative luminance of the `reference`.
 *
 * @param palette - The palette
 * @param reference - The color or gradient to match
 * @returns The index
 *
 * @public
 */
export function closestSwatchIndex(palette: Palette, reference: Paint): number {
    const target = relativeLuminance(reference);

    let cache = closestIndexCache.get(palette);
    if (!cache) {
        cache = new Map();
        closestIndexCache.set(palette, cache);
    }

    const cached = cache.get(target);
    if (cached !== undefined) {
        return cached;
    }

    let index = palette.swatches.indexOf(reference as Color);

    if (index === -1) {
        const all = swatchLuminances(palette);
        index = 0;
        for (let i = 1; i < all.length; i++) {
            if (Math.abs(all[i] - target) < Math.abs(all[index] - target)) {
                index = i;
            }
        }
    }

    cache.set(target, index);
    return index;
}
