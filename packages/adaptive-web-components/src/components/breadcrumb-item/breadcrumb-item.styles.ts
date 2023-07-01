import { css, ElementStyles } from "@microsoft/fast-element";
import { neutralForegroundRest } from "@adaptive-web/adaptive-ui/migration";
import {
    focusStrokeThickness,
    strokeThickness,
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .control {
        text-decoration: none;
        fill: currentcolor;
    }

    .control .content {
        position: relative;
    }

    .control .content::before {
        content: "";
        display: block;
        height: ${strokeThickness};
        left: 0;
        position: absolute;
        right: 0;
        top: calc(1em + 4px);
        width: 100%;
        background: currentcolor;
    }

    .control:focus-visible .content::before {
        height: ${focusStrokeThickness};
    }

    :host(:not([href])),
    :host([aria-current]) .control {
        color: ${neutralForegroundRest} !important;
        fill: currentcolor;
    }

    .separator {
        fill: currentcolor;
    }
`;
