import {
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-wrap: wrap;
        outline: none;
        user-select: none;
    }

    ::slotted([role="combobox"]) {
        box-sizing: border-box;
        width: auto;
        border: none;
        outline: none;
        user-select: none;
        font: inherit;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        min-height: calc(${heightNumber} * 1px);
        column-gap: calc(${designUnit} * 1px);
        row-gap: calc(${designUnit} * 1px);
        fill: currentcolor;
        padding: calc(${designUnit} * 1px) calc(${designUnit} * 2px);
    }

    :host(:not([disabled]):focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    ::slotted([role="combobox"]) {
        height: calc(${heightNumber} * 1px);
        padding: 0 calc(${designUnit} * 2px + 1px);
    }
`;
