import { FASTButton } from "@microsoft/fast-foundation";

/**
 * The Adaptive version of Button. Extends {@link @microsoft/fast-foundation#FASTButton}.
 *
 * @public
 */
export class Button extends FASTButton {
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

    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}
