import { FASTAnchor } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Anchor. Extends {@link @microsoft/fast-foundation#FASTAnchor}.
 *
 * @public
 */
export class AdaptiveAnchor extends FASTAnchor {
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot.
     */
    protected defaultSlottedContentChanged(): void {
        const slottedElements = this.defaultSlottedContent.filter((x) => x.nodeType === Node.ELEMENT_NODE);

        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");
        } else {
            this.control.classList.remove("icon-only");
        }
    }
}
