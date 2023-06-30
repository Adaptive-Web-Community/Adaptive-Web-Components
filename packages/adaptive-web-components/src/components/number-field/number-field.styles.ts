import {
    focusStrokeOuter,
    focusStrokeWidth,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
        user-select: none;
    }

    .label {
        display: block;
        cursor: pointer;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .root {
        display: flex;
        align-items: center;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
    }

    .control:focus-visible {
        outline: none;
    }

    .controls {
        opacity: 0;
    }

    :host(:enabled:hover) .controls,
    :host(:enabled:focus-within) .controls {
        opacity: 1;
    }

    .step-up,
    .step-down {
        display: flex;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host([disabled]) .label,
    :host([disabled]) .control {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .label {
        margin-bottom: 4px;
    }

    .root {
        fill: currentcolor;
    }

    :host(:enabled:focus-within) .root {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    .control {
        height: calc(100% - 4px);
    }

    .step-up,
    .step-down {
        padding: 1px 10px;
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
