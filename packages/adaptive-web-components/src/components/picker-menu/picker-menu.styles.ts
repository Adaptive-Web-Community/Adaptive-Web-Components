import { elevationFlyout, layerFillFixedPlus1 } from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        pointer-events: auto;
        z-index: 1000;
    }

    .suggestions-available-alert {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }
`;
