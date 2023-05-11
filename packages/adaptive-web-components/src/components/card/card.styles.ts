import {
    elevationCardFocus,
    elevationCardHover,
    elevationCardRest,
    layerFillInteractiveActive,
    layerFillInteractiveHover,
    layerFillInteractiveRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        background: ${layerFillInteractiveRest};
        box-shadow: ${elevationCardRest}
    }

    :host(:hover) {
        background: ${layerFillInteractiveHover};
        box-shadow: ${elevationCardHover}
    }

    :host(:focus-within) {
        background: ${layerFillInteractiveActive};
        box-shadow: ${elevationCardFocus}
    }
`;
