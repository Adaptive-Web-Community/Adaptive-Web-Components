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
        display: flex;
        align-items: center;
        white-space: nowrap;
        /* explicit width */
        flex-grow: 1;
        justify-content: center;
        /* reset */
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
`;
