import {
    elevationFlyout,
    focusStrokeOuter,
    focusStrokeThickness,
    layerFillFixedPlus1,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
        font: inherit;
        padding: unset;
    }

    .selected-value:focus-visible {
        outline: none;
    }

    :host(:active) .selected-value {
        user-select: none;
    }

    .listbox {
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        min-width: 250px;
        fill: currentcolor;
    }

    :host(:focus-within) .control {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }

    /* ideally the option can take care of itself
    :host(:focus-visible) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    } */

    .control {
        min-height: 100%;
        width: 100%;
    }

    .selected-value {
        flex: 1 1 auto;
        text-align: start;
    }

    .listbox {
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
