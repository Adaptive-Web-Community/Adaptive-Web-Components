import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
    }

    .control {
        display: inline-flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        /* reset */
        font: inherit;
        border: none;
        margin: 0;
        padding: 0;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host(:not([disabled])) .control {
        cursor: pointer;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .control {
        fill: currentcolor;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }
`;
