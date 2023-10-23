import {
    designUnit,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
        margin: 0;
        padding: unset;
        border: none;
        background: transparent;
        color: inherit;
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
        display: inline-block;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
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
        fill: currentcolor;
    }

    .clear-button {
        margin: 1px;
        height: calc(100% - 2px);
        min-width: calc(${heightNumber} * 1px);
        padding: 0 calc(10px + (${designUnit} * (2 * ${density})));
        fill: currentcolor;
    }
`;
