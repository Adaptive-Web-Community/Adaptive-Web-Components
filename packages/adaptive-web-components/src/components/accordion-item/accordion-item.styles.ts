import { css, ElementStyles } from "@microsoft/fast-element";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: flex;
        position: relative;
        align-items: center;
        z-index: 2;
    }

    .button {
        border: none;
        background: none;
        text-align: left;
        flex-grow: 1;
        padding: unset;
        outline: none;
        cursor: pointer;
        font: inherit;
    }

    .button::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        cursor: pointer;
    }

    .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    slot[name$="-icon"] * {
        display: flex;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::slotted([slot="start"]) {
        order: -1;
    }

    .panel {
        display: flex;
    }

    .panel[hidden] {
        display: none;
    }

    :host([disabled]) .button::before {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host(:not([disabled])) .button:focus-visible::before {
        outline: ${tokenVar(tokens.shape.strokeThickness.focus)} solid ${tokenVar(tokens.color.focusStroke.outer)};
    }
`;
