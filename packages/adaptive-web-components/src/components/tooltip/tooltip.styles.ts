import {
    controlCornerRadius,
    elevationTooltip,
    neutralFillSubtleRest,
    neutralStrokeSubtleRest,
    strokeWidth,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        visibility: hidden;
    }

    :host([visible]) {
        visibility: visible;
    }
    
    :host(:not([visible])) {
        visibility: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        position: fixed;
        box-sizing: border-box;
        height: fit-content;
        width: fit-content;
        padding: 4px 12px;
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillSubtleRest};
        white-space: nowrap;
        box-shadow: ${elevationTooltip};
    }

    :host([visible]) {
        transition: visibility 0s 0s linear, opacity 50ms 0.5s linear;
        opacity: 1;
    }

    :host(:not([visible])) {
        transition: visibility 0s 0.5s, opacity 50ms linear;
        opacity: 0;
    }

    :host([show="true"][visible]) {
        transition: none;
    }
`;
