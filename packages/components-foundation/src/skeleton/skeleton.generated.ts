/* eslint-disable */
// This file is generated from src/skeleton/skeleton.documentation.ts by @adaptive-web/adaptive-ui. Do not edit directly.

/**
 * Part names of Skeleton for templates (`part` and class). Keys are structure ids; values are kebab-case DOM names. Style rules target the keys via anatomy—not these strings.
 *
 * @public
 */
export const SkeletonParts = {
    /** The moving highlight when `shimmer` is set. */
    shimmer: "shimmer",

    /** An image of the content shape when `pattern` is set. */
    pattern: "pattern",
} as const;

/**
 * Slot names of Skeleton.
 *
 * @public
 */
export const SkeletonSlots = {
    /** Optional custom shape content such as SVG. */
    default: "",
} as const;

/**
 * The skeleton shape. The default is `rect`.
 *
 * @public
 */
export const SkeletonShape = {
    /** A rectangle. */
    rect: "rect",

    /** A circle. */
    circle: "circle",
} as const;

/** @public */
export type SkeletonShape = (typeof SkeletonShape)[keyof typeof SkeletonShape];

/**
 * A **Skeleton** is the shape of content that is loading, in its place. It is hidden from assistive technology (`aria-hidden`).
 *
 * @public
 */
export interface SkeletonContract {
    /**
     * The skeleton shape. The default is `rect`.
     */
    shape: SkeletonShape;

    /**
     * Whether a highlight moves across the skeleton.
     */
    shimmer: boolean;

    /**
     * The URL of an image of the content's shape.
     */
    pattern: string | null;
}
