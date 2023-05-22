import {
    focusStrokeOuter,
    focusStrokeWidth,
    layerFillFixedPlus1,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        background: ${layerFillFixedPlus1};
    }

    :host(:not([disabled]):focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
