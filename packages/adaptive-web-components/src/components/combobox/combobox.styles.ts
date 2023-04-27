import {
    controlCornerRadius,
    designUnit,
    elevationFlyout,
    focusStrokeOuter,
    focusStrokeWidth,
    layerFillFixedPlus1,
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
        display: inline-flex;
        position: relative;
        user-select: none;
        vertical-align: top;
    }

    .control {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .indicator {
        display: flex;
    }

    .selected-value {
        -webkit-appearance: none;
        background: transparent;
        border: none;
        color: inherit;
    }

    .selected-value:focus-visible {
        outline: none;
    }

    :host(:active) .selected-value {
        user-select: none;
    }

    .listbox {
        box-sizing: border-box;
        z-index: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
    }

    :host(:empty) .listbox,
    .listbox[hidden] {
        display: none;
    }

    :host([disabled]) .control,
    :host([disabled]) .selected-value {
        cursor: not-allowed;
        user-select: none;
    }

    ::slotted([role="option"]) {
        flex: 0 0 auto;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        min-width: 250px;
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        fill: currentcolor;
        ${typeRampBase}
    }

    :host(:focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    /* ideally the option can take care of itself
    :host(:focus-visible) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    } */

    .control {
        box-sizing: border-box;
        min-height: 100%;
        width: 100%;
        padding: 0 calc(${designUnit} * 2.25px);
    }

    .selected-value {
        font-family: inherit;
        flex: 1 1 auto;
        text-align: start;
    }

    .listbox {
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 1px) 0;
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
