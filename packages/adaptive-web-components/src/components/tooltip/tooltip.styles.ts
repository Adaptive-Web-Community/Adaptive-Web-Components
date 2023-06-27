import {
    elevationTooltip,
    neutralFillSubtleRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        position: fixed;
        height: fit-content;
        width: fit-content;
        padding: 4px 12px;
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
