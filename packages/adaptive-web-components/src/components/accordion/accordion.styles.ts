import { css, ElementStyles } from "@microsoft/fast-element";
import { neutralStrokeSubtleRest, strokeWidth } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
    }
`;
