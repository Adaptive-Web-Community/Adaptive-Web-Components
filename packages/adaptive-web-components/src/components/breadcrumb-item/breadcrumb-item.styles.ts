import { css, ElementStyles } from "@microsoft/fast-element";
import {
    accentForegroundActive,
    accentForegroundHover,
    accentForegroundRest,
    focusStrokeWidth,
    neutralForegroundRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-flex;
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        display: flex;
        align-items: center;
        cursor: pointer;
        outline: none;
        white-space: nowrap;
    }

    :host(:not([href])),
    :host([aria-current]) .control {
        cursor: default;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .separator {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        min-width: calc(${heightNumber} * 1px);
        ${typeRampBase}
    }

    .listitem {
        gap: 8px;
    }

    .control {
        box-sizing: border-box;
        text-decoration: none;
        color: ${accentForegroundRest};
        fill: currentcolor;
    }

    .control:hover {
        color: ${accentForegroundHover};
    }

    .control:active {
        color: ${accentForegroundActive};
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: calc(${strokeWidth} * 1px);
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
    }

    .control:hover .content::before {
        background: ${accentForegroundHover};
    }

    .control:active .content::before {
        background: ${accentForegroundActive};
    }

    .control:focus-visible .content::before {
        background: ${neutralForegroundRest};
        height: calc(${focusStrokeWidth} * 1px);
    }

    :host(:not([href])),
    :host([aria-current]) .control {
        color: ${neutralForegroundRest} !important;
        fill: currentcolor;
    }

    .separator {
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }
`;

/**
 * Default Adaptive UI Breadcrumb Item styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
