import { css, ElementStyles } from "@microsoft/fast-element";
import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    strokeWidth,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        overflow: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border: transparent calc(${strokeWidth} * 1px) solid;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 1px) calc(${designUnit} * 3px);
        fill: currentcolor;
        white-space: nowrap;
    }

    :host([cell-type="columnheader"]),
    :host([cell-type="rowheader"]) {
        font-weight: 600;
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
