import {
    foregroundOnAccentRest,
} from "@adaptive-web/adaptive-ui/migration";
import {
    accentFillReadableRest,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host([aria-selected="true"]) {
        background: ${accentFillReadableRest};
        color: ${foregroundOnAccentRest};
    }
`;
