import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralForegroundActive,
    neutralForegroundHover,
    neutralForegroundRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        grid-row: 1;
        cursor: pointer;
    }

    :host([aria-selected="true"]) {
        z-index: 2;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        color: ${neutralForegroundRest};
        fill: currentcolor;
        ${typeRampBase}
    }

    :host(:not([disabled]):hover) {
        color: ${neutralForegroundHover};
    }

    :host(:not([disabled]):active) {
        color: ${neutralForegroundActive};
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;

/**
 * Default Adaptive UI Tab styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
