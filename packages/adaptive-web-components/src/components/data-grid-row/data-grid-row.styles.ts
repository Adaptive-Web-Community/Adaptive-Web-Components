import { css, ElementStyles } from "@microsoft/fast-element";
import { neutralFillSubtleRest, neutralStrokeSubtleRest, strokeWidth } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: grid;
        box-sizing: border-box;
        width: 100%;
    }

    :host([cell-type="sticky-header"]) {
        position: sticky;
        top: 0;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        padding: 1px 0;
        border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
    }

    :host([cell-type="sticky-header"]) {
        background: ${neutralFillSubtleRest};
    }
`;
