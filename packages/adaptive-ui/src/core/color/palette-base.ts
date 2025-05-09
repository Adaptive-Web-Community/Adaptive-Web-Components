import { Color } from "./color.js";
import { Palette, PaletteDirection, PaletteDirectionValue, resolvePaletteDirection } from "./palette.js";
import { binarySearch } from "./utilities/binary-search.js";
import { directionByIsDark } from "./utilities/direction-by-is-dark.js";
import { contrast, RelativeLuminance } from "./utilities/relative-luminance.js";

/**
 * A base {@link Palette} with a common implementation of the interface. Use PaletteRGB for an implementation
 * of a palette generation algorithm that is ready to be used directly, or extend this class to generate custom swatches.
 *
 * @public
 */
export class BasePalette<T extends Color = Color> implements Palette<T> {
    /**
     * {@inheritdoc Palette.source}
     */
    readonly source: Color;

    /**
     * {@inheritdoc Palette.swatches}
     */
    readonly swatches: ReadonlyArray<T>;

    /**
     * An index pointer to the end of the palette.
     */
    readonly lastIndex: number;

    /**
     * A copy of the swatches in reverse order, used for optimized searching.
     */
    readonly reversedSwatches: ReadonlyArray<T>;

    /**
     * Cache from `relativeLuminance` to swatch index in the `Palette`.
     */
    readonly closestIndexCache = new Map<number, number>();

    /**
     * Creates a new Palette.
     *
     * @param source - The source color for the Palette
     * @param swatches - All swatches in the Palette
     */
    constructor(source: Color, swatches: ReadonlyArray<T>) {
        this.source = source;
        this.swatches = swatches;

        this.reversedSwatches = Object.freeze([...this.swatches].reverse());
        this.lastIndex = this.swatches.length - 1;
    }

    /**
     * {@inheritdoc Palette.colorContrast}
     */
    colorContrast(
        reference: RelativeLuminance,
        contrastTarget: number,
        initialSearchIndex?: number,
        direction: PaletteDirection = directionByIsDark(reference)
    ): T {
        if (initialSearchIndex === undefined) {
            initialSearchIndex = this.closestIndexOf(reference);
        }

        let source: ReadonlyArray<T> = this.swatches;
        const endSearchIndex = this.lastIndex;
        let startSearchIndex = initialSearchIndex;

        const condition = (value: T) => contrast(reference, value) >= contrastTarget;

        if (direction === PaletteDirectionValue.lighter) {
            source = this.reversedSwatches;
            startSearchIndex = endSearchIndex - startSearchIndex;
        }

        return binarySearch(source, condition, startSearchIndex, endSearchIndex);
    }

    /**
     * {@inheritdoc Palette.delta}
     */
    delta(reference: RelativeLuminance, delta: number, direction: PaletteDirection): T {
        const dir = resolvePaletteDirection(direction);
        return this.get(this.closestIndexOf(reference) + dir * delta);
    }

    /**
     * {@inheritdoc Palette.closestIndexOf}
     */
    closestIndexOf(reference: RelativeLuminance): number {
        if (this.closestIndexCache.has(reference.relativeLuminance)) {
            /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
            return this.closestIndexCache.get(reference.relativeLuminance)!;
        }

        let index = this.swatches.indexOf(reference as T);

        if (index !== -1) {
            this.closestIndexCache.set(reference.relativeLuminance, index);
            return index;
        }

        const closest = this.swatches.reduce((previous, next) =>
            Math.abs(next.relativeLuminance - reference.relativeLuminance) <
                Math.abs(previous.relativeLuminance - reference.relativeLuminance)
                ? next
                : previous
        );

        index = this.swatches.indexOf(closest);
        this.closestIndexCache.set(reference.relativeLuminance, index);

        return index;
    }

    /**
     * Ensures that an input number does not exceed a max value and is not less than a min value.
     *
     * @param i - the number to clamp
     * @param min - the maximum (inclusive) value
     * @param max - the minimum (inclusive) value
     */
    private clamp(i: number, min: number, max: number): number {
        if (isNaN(i) || i <= min) {
            return min;
        } else if (i >= max) {
            return max;
        }
        return i;
    }

    /**
     * {@inheritdoc Palette.get}
     */
    get(index: number): T {
        return this.swatches[index] || this.swatches[this.clamp(index, 0, this.lastIndex)];
    }
}
