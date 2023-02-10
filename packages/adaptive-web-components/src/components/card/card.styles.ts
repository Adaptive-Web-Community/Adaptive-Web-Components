import {
    elevationCardFocus,
    elevationCardHover,
    elevationCardRest,
    layerCornerRadius,
    layerFillInteractiveActive,
    layerFillInteractiveHover,
    layerFillInteractiveRest,
    neutralForegroundRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        background: ${layerFillInteractiveRest};
        color: ${neutralForegroundRest};
        border-radius: calc(${layerCornerRadius} * 1px);
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

/**
 * Default Adaptive UI Card styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
