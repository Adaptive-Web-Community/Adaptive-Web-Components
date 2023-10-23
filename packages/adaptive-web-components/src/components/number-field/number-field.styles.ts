import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
        user-select: none;
    }

    .label {
        display: inline-block;
        cursor: pointer;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .root {
        display: flex;
        align-items: center;
    }

    .control {
        -webkit-appearance: none;
        width: 100%;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
    }

    .controls {
        opacity: 0;
    }

    :host(:enabled:hover) .controls,
    :host(:enabled:focus-within) .controls {
        opacity: 1;
    }

    .step-up,
    .step-down {
        display: flex;
        cursor: pointer;
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
    .label {
        margin-bottom: 4px;
    }

    .root {
        fill: currentcolor;
    }

    .control {
        height: calc(100% - 4px);
    }

    .step-up,
    .step-down {
        padding: 1px 10px;
    }
`;
