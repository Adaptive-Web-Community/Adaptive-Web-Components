import { FASTButton } from "@microsoft/fast-foundation";
import { applyMixins } from "@adaptive-web/adaptive-ui";
import { TooltipProvider } from "../../utilities/tooltip-provider.js";

/**
 * The Adaptive version of Button. Extends {@link @microsoft/fast-foundation#FASTButton}.
 *
 * @public
 */
export class AdaptiveButton extends FASTButton implements TooltipProvider {
    /**
     * Applies 'icon-only' class when there is only an SVG in the default slot.
     */
    protected defaultSlottedContentChanged(): void {
        const slottedElements = this.defaultSlottedContent.filter((x) => x.nodeType === Node.ELEMENT_NODE);

        if (slottedElements.length === 1 && slottedElements[0] instanceof SVGElement) {
            this.control.classList.add("icon-only");

            this.provideTooltip(this);
        } else {
            this.control.classList.remove("icon-only");
        }
    }

    public focus(options?: FocusOptions): void {
        this.control.focus(options);
    }
}

/**
 * Mark internal because exporting class and interface of the same name
 * confuses API documenter.
 * TODO: https://github.com/microsoft/fast/issues/3317
 * @internal
 */
export interface AdaptiveButton extends TooltipProvider {}
applyMixins(FASTButton, TooltipProvider);
