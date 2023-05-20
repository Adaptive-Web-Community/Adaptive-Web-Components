import { css, ElementStyles } from "@microsoft/fast-element";
import {
    focusStrokeOuter,
    focusStrokeWidth,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        overflow: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
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
