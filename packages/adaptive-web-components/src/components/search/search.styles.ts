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
        display: inline-flex;
        flex-direction: column;
    }

    .label {
        align-self: start;
        cursor: pointer;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .root,
    .input-wrapper {
        display: flex;
        align-items: center;
    }

    .control {
        -webkit-appearance: none;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
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
    .clear-button {
        margin: 1px;
        height: calc(100% - 2px);
        min-width: calc(${heightNumber} * 1px);
        padding: 0 calc(10px + (${designUnit} * (2 * ${density})));
    }
`;
