import {
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
    neutralStrokeActive,
    neutralStrokeHover,
    neutralStrokeRest,
    strokeWidth,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

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
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        width: calc(${heightNumber} * 1px);
        height: calc(${heightNumber} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        border-radius: 50%;
        background: ${neutralFillStealthRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:hover) {
        border-color: ${neutralStrokeHover};
        background: ${neutralFillStealthHover};
    }

    :host(:active) {
        border-color: ${neutralStrokeActive};
        background: ${neutralFillStealthActive};
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;

/**
 * Default Adaptive UI Flipper styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
