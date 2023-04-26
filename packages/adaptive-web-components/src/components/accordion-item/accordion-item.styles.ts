import { css, ElementStyles } from "@microsoft/fast-element";
import {
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralStrokeSubtleRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
    }

    .heading {
        display: grid;
        position: relative;
        grid-template-columns: auto 1fr auto auto;
        z-index: 2;
    }

    .button {
        appearance: none;
        border: none;
        background: none;
        text-align: left;
        grid-column: 2;
        grid-row: 1;
        outline: none;
        cursor: pointer;
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
        grid-column: 4;
        pointer-events: none;
    }

    slot[name="collapsed-icon"] * {
        display: flex;
    }

    :host([expanded]) slot[name="collapsed-icon"] * {
        display: none;
    }

    slot[name="expanded-icon"] * {
        display: none;
    }

    :host([expanded]) slot[name="expanded-icon"] * {
        display: flex;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    ::slotted([slot="start"]) {
        grid-column: 1;
    }

    ::slotted([slot="end"]) {
        grid-column: 3;
    }

    .region {
        display: none;
    }

    :host([expanded]) .region {
        display: flex;
    }

    :host([disabled]) .button::before {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
        ${typeRampBase}
    }

    .button {
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
        height: calc(${heightNumber} * 1px);
        font-family: inherit;
    }

    :host(:not([disabled])) .button:focus-visible::before {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    .icon {
        height: calc(${heightNumber} * 1px);
        width: calc(${heightNumber} * 1px);
        fill: currentcolor;
    }

    .region {
        padding: calc((6 + (${designUnit} * 2 * ${density})) * 1px);
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
