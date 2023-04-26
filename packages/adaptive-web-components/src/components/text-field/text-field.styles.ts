import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
        user-select: none;
        /* position: relative; */
    }

    .root {
        display: flex;
    }

    .control {
        -webkit-appearance: none;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: block;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host([disabled]) .label,
    :host([disabled]) .root,
    :host([disabled]) .control {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        ${typeRampBase}
        fill: currentcolor;
    }

    .label {
        margin-bottom: 4px;
    }

    .root {
        /*position: relative;*/
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        fill: currentcolor;
    }

    :host(:not([disabled]):focus-within) .root {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    .control {
        height: calc(100% - 4px);
        width: 100%;
        margin-top: auto;
        margin-bottom: auto;
        padding: 0 calc(${designUnit} * 2px + 1px);
        border: none;
        background: transparent;
        color: inherit;
        font-family: inherit;
    }

    .control:focus-visible {
        outline: none;
    }
`;
