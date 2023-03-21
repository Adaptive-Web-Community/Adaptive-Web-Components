import { neutralStrokeSubtleRest, strokeWidth } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: content-box;
        border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
    }

    :host([orientation="vertical"]) {
        border-top: none;
        height: 100%;
        border-left: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
    }
`;
