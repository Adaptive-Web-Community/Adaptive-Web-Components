import { css, ElementStyles } from "@microsoft/fast-element";
import { designUnit, elevationFlyout, layerCornerRadius, layerFillFixedPlus1, strokeWidth } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
    }

    .region {
        display: flex;
        z-index: 1000;
    }

    .loaded {
        opacity: 1;
        pointer-events: none;
    }

    .loading-display,
    .no-options-display {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        justify-items: center;
    }

    .bottom {
        flex-direction: column;
    }

    .top {
        flex-direction: column-reverse;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .loading-display,
    .no-options-display {
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${layerCornerRadius} * 1px);
        padding: calc(${designUnit} * 1px);
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }
`;
