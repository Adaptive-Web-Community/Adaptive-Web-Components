import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        position: relative;
        vertical-align: top;
    }

    .control {
        display: flex;
        align-items: center;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .indicator {
        display: flex;
    }

    .selected-value {
        width: 100%;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
    }

    .listbox {
        z-index: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        /* For Floating UI to calc default position */
        position: fixed;
        top: 0;
        left: 0;
    }

    :host(:empty) .listbox,
    .listbox[hidden] {
        display: none;
    }

    ::slotted([role="option"]) {
        flex: 0 0 auto;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
