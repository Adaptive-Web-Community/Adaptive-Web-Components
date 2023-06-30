import {
    focusStrokeOuter,
    focusStrokeWidth,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    :host::-moz-focus-inner {
        border: 0;
    }

    .next,
    .previous {
        display: flex;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        width: calc(${heightNumber} * 1px);
        height: calc(${heightNumber} * 1px);
        border-radius: 50% !important;
        padding: 0 !important;
        fill: currentcolor;
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
