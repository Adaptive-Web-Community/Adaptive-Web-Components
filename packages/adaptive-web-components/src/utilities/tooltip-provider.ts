import { FASTTooltip, tagFor } from "@microsoft/fast-foundation";
import { uniqueId } from "@microsoft/fast-web-utilities";

export class TooltipProvider {
    public provideTooltip(element: HTMLElement) {
        if (element.ariaLabel) {
            if (!element.id) {
                element.id = uniqueId("tooltipAnchor");
            }
            const tooltip = document.createElement(tagFor(FASTTooltip)) as FASTTooltip;
            tooltip.innerText = element.ariaLabel;
            tooltip.anchor = element.id;
            element.parentNode?.insertBefore(tooltip, element);
        }
    }
}
