import { css, ElementStyles } from "@microsoft/fast-element";
import {
    focusStrokeOuter,
    focusStrokeWidth,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
        font: inherit;
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
    }

    .control {
        white-space: nowrap;
        fill: currentcolor;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    .control:focus-visible {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
