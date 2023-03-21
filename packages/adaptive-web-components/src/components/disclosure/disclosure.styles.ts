import {
    accentFillReadableActive,
    accentFillReadableHover,
    accentFillReadableRest,
    controlCornerRadius,
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
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
        outline: none;
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
 */
export const aestheticStyles: ElementStyles = css`
    .invoker {
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${accentFillReadableRest};
        color: ${foregroundOnAccentRest};
        fill: currentcolor;
        padding: 12px;
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
