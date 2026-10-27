import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
    }

    .label {
        align-self: start;
        cursor: pointer;
    }

    .label[hidden] {
        display: none;
    }

    .root {
        display: flex;
        align-items: center;
    }

    .control {
        width: 100%;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
    }


    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
