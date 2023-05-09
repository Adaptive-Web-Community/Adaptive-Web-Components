import { css, ElementStyles } from "@microsoft/fast-element";
import {
    designUnit,
    strokeWidth,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    .control {
        padding:
            calc(((${designUnit} * 0.5) - ${strokeWidth}) * 1px)
            calc((${designUnit} - ${strokeWidth}) * 1px);
        fill: currentcolor;
    }
`;
