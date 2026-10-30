import type { DefaultAria } from "../utilities/aria.js";
import type { ValuesOf } from "../utilities/typings.js";

/**
 * The shape of a {@link SkeletonElement}.
 *
 * @public
 */
export const SkeletonShape = {
    rect: "rect",
    circle: "circle",
} as const;

/**
 * The shape of a {@link SkeletonElement}.
 *
 * @public
 */
export type SkeletonShape = ValuesOf<typeof SkeletonShape>;

/**
 * The parts of a {@link SkeletonElement}.
 *
 * @public
 */
export const SkeletonParts = {
    /** The highlight that moves across the skeleton, when it shimmers. */
    shimmer: "shimmer",

    /** The image of the pattern, when it has one. */
    pattern: "pattern",
} as const;

/**
 * A skeleton: the shape of content that is loading, in its place. It is hidden from assistive technology (`aria-hidden`), since it has nothing
 * to read; the container that is loading has `aria-busy`.
 *
 * @remarks
 * Slots: the default slot, for a shape of the author's such as an SVG.
 *
 * @public
 */
export interface SkeletonElement extends HTMLElement {
    /**
     * The shape.
     *
     * @remarks
     * HTML attribute: `shape`. The default is `rect`.
     */
    shape: SkeletonShape;

    /**
     * Whether a highlight moves across it.
     *
     * @remarks
     * HTML attribute: `shimmer`.
     */
    shimmer: boolean;

    /**
     * The URL of an image of the content's shape, such as a card's.
     *
     * @remarks
     * HTML attribute: `pattern`.
     */
    pattern: string | null;
}

/**
 * The default ARIA of a skeleton: hidden.
 *
 * @public
 */
export function skeletonAria(): DefaultAria {
    return {
        ariaHidden: "true",
    };
}
