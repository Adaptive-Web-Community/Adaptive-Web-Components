import {
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
} from "@adaptive-web/adaptive-ui/migration";
import {
    accentFillReadableActive,
    accentFillReadableHover,
    accentFillReadableRest,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }

    .invoker::-webkit-details-marker {
        display: none;
    }

    .invoker {
        display: flex;
        align-items: center;
        list-style-type: none;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    #disclosure-content {
        display: none;
    }

    :host([expanded]) #disclosure-content {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .invoker {
        background: ${accentFillReadableRest};
        color: ${foregroundOnAccentRest};
        fill: currentcolor;
        max-width: max-content;
    }

    .invoker:hover {
        background: ${accentFillReadableHover};
        color: ${foregroundOnAccentHover};
    }

    .invoker:active {
        background: ${accentFillReadableActive};
        color: ${foregroundOnAccentActive};
    }
`;
