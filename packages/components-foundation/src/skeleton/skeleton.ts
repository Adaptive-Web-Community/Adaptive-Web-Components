import type { DefaultAria } from "../utilities/aria.js";
import type { SkeletonContract } from "./skeleton.generated.js";

/**
 * A skeleton: the shape of content that is loading, in its place. It is hidden from assistive technology (`aria-hidden`), since it has nothing
 * to read; the container that is loading has `aria-busy`.
 *
 * @remarks
 * Slots: the default slot, for a shape of the author's such as an SVG.
 *
 * @public
 */
export interface SkeletonElement extends HTMLElement, SkeletonContract {}

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
