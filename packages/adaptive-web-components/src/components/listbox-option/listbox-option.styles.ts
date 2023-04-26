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
        display: inline-flex;
        align-items: center;
        overflow: hidden;
        user-select: none;
        white-space: nowrap;
        cursor: pointer;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }

    .content {
        /* justify-self: start; */
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        margin: 0 calc(${designUnit} * 1px);
        gap: 8px;
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: 0 calc(${designUnit} * 2.25px);
        fill: currentcolor;
        ${typeRampBase}
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([disabled]) {
        opacity: 0.3;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;
