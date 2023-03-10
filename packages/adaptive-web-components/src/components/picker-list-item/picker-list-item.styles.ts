import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthActive,
    neutralFillStealthHover,
    neutralFillStealthRest,
    neutralForegroundRest,
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
        display: flex;
        align-items: center;
        justify-items: center;
        overflow: hidden;
        white-space: nowrap;
        user-select: none;
        cursor: pointer;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillStealthRest};
        padding: 0 calc(${designUnit} * 1px);
        color: ${neutralForegroundRest};
        fill: currentcolor;
        ${typeRampBase}
    }

    :host(:hover) {
        background: ${neutralFillStealthHover};
    }

    :host(:active) {
        background: ${neutralFillStealthActive};
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
