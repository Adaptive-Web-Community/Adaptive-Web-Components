import { css, ElementStyles } from "@microsoft/fast-element";
import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
    }

    .control {
        display: inline-flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        outline: none;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host(:not([disabled])) .control {
        cursor: pointer;
    }

    :host([disabled]) .control {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        border-radius: calc(${controlCornerRadius} * 1px);
        ${typeRampBase}
    }

    .control {
        border: calc(${strokeWidth} * 1px) solid transparent;
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
        border-radius: inherit;
        white-space: nowrap;
        fill: currentcolor;
        font-family: inherit;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    .control:focus-visible {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
