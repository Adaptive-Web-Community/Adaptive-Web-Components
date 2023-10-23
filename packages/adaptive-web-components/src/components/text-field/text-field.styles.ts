import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
        user-select: none;
        /* position: relative; */
    }

    .root {
        display: flex;
        align-items: center;
    }

    .control {
        -webkit-appearance: none;
        width: 100%;
        margin: 0;
        padding: unset;
        border: none;
        background: transparent;
        color: inherit;
        font: inherit;
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: inline-block;
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
    :host {
        fill: currentcolor;
    }

    .label {
        margin-bottom: 4px;
    }

    .root {
        /*position: relative;*/
        fill: currentcolor;
    }

    .control {
        height: 100%;
    }
`;
