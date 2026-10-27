import type { ValuesOf } from "../utilities/typings.js";

/**
 * Where a {@link TooltipElement} is shown, next to its anchor, in the writing direction: `above` and `below` the anchor, `before` and
 * `after` it in the line, and the `-start` and `-end` alignments.
 *
 * @public
 */
export const TooltipPlacement = {
    above: "above",
    aboveStart: "above-start",
    aboveEnd: "above-end",
    below: "below",
    belowStart: "below-start",
    belowEnd: "below-end",
    before: "before",
    beforeTop: "before-top",
    beforeBottom: "before-bottom",
    after: "after",
    afterTop: "after-top",
    afterBottom: "after-bottom",
} as const;

/**
 * Where a {@link TooltipElement} is shown, next to its anchor.
 *
 * @public
 */
export type TooltipPlacement = ValuesOf<typeof TooltipPlacement>;

/**
 * A tooltip (`role="tooltip"`): a short description of its anchor, shown while the anchor has the focus or the pointer. It is a popover
 * (`popover="manual"`), in the top layer, positioned next to its anchor by CSS anchor positioning, since it is shown with the anchor as its
 * source. It describes its anchor (`aria-describedby`, through element reflection).
 *
 * @remarks
 * Its anchor is any element that takes focus; a tooltip on an element that doesn't is out of reach of the keyboard and of assistive
 * technology. It stays shown while the pointer is over it, and Escape hides it.
 *
 * Slots: the default slot for the description.
 *
 * @public
 */
export interface TooltipElement extends HTMLElement {
    /**
     * The element it describes.
     *
     * @remarks
     * HTML attribute: `anchor`, the element's id. Setting the property to an element sets it directly.
     */
    anchorElement: Element | null;

    /**
     * Where it is shown, next to its anchor. The styles of the template place it.
     *
     * @remarks
     * HTML attribute: `placement`. The default is `above`.
     */
    placement: TooltipPlacement;

    /**
     * The milliseconds the pointer stays on the anchor before it is shown, and leaves before it is hidden. Focus shows and hides it at once.
     *
     * @remarks
     * HTML attribute: `delay`. The default is 300.
     */
    delay: number;
}
