import {
    designUnit,
    elevationFlyout,
    focusStrokeOuter,
    focusStrokeThickness,
    layerFillFixedPlus1,
    strokeThickness,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

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

    :host(:not([aria-haspopup])) {
        height: auto;
        min-width: 0;
    }

    :host([size="0"]) .listbox {
        max-height: none;
    }

    .control {
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 100%;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .indicator {
        display: flex;
    }

    .selected-value {
        flex: 1 1 auto;
    }

    .indicator {
        flex: 0 0 auto;
    }

    .listbox {
        z-index: 1;
        display: flex;
        flex-direction: column;
        position: fixed;
        overflow-y: auto;
    }

    .listbox[hidden] {
        display: none;
    }

    ::slotted([role="option"]) {
        flex: 0 0 auto;
    }

    :host([disabled]) .control {
        cursor: not-allowed;
        user-select: none;
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

    :host(:focus-visible) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }

    /* ideally the option can take care of itself
    :host(:focus-visible) ::slotted([aria-selected="true"][role="option"]:not([disabled])) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    } */

    .listbox {
        max-height: calc((var(--size, 0) * ${heightNumber}) * 1px + (${designUnit} + ${strokeThickness} * 2));
        background: ${layerFillFixedPlus1};
    }

    :host([aria-haspopup]) .listbox {
        box-shadow: ${elevationFlyout};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
