import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    strokeWidth,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
        user-select: none;
        /* position: relative; */
    }

    .root,
    .input-wrapper {
        display: flex;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
    }

    .control::-webkit-search-cancel-button {
        -webkit-appearance: none;
    }

    .clear-button {
        opacity: 0;
        background: transparent;
        border: none;
        outline: none;
        font: inherit;
    }

    .clear-button__hidden {
        opacity: 0;
    }

    :host(:not([disabled], [readonly]):hover) .clear-button,
    :host(:not([disabled], [readonly]):active) .clear-button,
    :host(:not([disabled], [readonly]):focus-within) .clear-button {
        opacity: 1;
    }

    :host(:not([disabled], [readonly]):hover) .clear-button__hidden,
    :host(:not([disabled], [readonly]):active) .clear-button__hidden,
    :host(:not([disabled], [readonly]):focus-within) .clear-button__hidden {
        opacity: 0;
    }

    .label.label__hidden {
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
    }

    .control:focus-visible {
        outline: none;
    }

    .clear-button {
        margin: 1px;
        height: calc(100% - 2px);
        min-width: calc(${heightNumber} * 1px);
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
        fill: currentcolor;
    }
`;
