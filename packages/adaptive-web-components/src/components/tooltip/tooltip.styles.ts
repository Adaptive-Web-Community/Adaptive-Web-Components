import {
    elevationTooltip,
    neutralFillSubtleRest,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        height: fit-content;
        width: fit-content;
        white-space: nowrap;
        visibility: hidden;
    }

    :host([visible]) {
        visibility: visible;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        background: ${neutralFillSubtleRest};
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
