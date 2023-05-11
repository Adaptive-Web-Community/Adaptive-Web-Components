import {
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillStealthActive,
    neutralStrokeReadableRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: grid;
        align-items: center;
        justify-items: center;
        white-space: nowrap;
        /* unmanaged columns: start, content, end, submenu */
        grid-template-columns: auto 1fr auto var(--col-width);
        grid-template-rows: auto;
        cursor: pointer;
    }

    /* managed columns: content, end?, submenu? */

    :host([start-column-count="0"]) {
        grid-template-columns: 1fr auto var(--col-width);
    }

    :host([start-column-count="0"]) ::slotted([slot="end"]) {
        grid-column: 2;
    }

    :host([start-column-count="0"]) .submenu-icon {
        grid-column: 3;
    }

    /* managed columns: indicator OR start, content, end?, submenu? */

    :host([start-column-count="1"]) {
        grid-template-columns: var(--col-width) 1fr auto var(--col-width);
    }

    :host([start-column-count="1"]) .content {
        grid-column: 2;
    }

    :host([start-column-count="1"]) ::slotted([slot="end"]) {
        grid-column: 3;
    }

    :host([start-column-count="1"]) .submenu-icon {
        grid-column: 4;
    }

    /* managed columns: indicator, start, content, end?, submenu? */

    :host([start-column-count="2"]) {
        grid-template-columns: var(--col-width) var(--col-width) 1fr auto var(--col-width);
    }

    :host([start-column-count="2"]) ::slotted([slot="start"]) {
        grid-column: 2;
    }

    :host([start-column-count="2"]) .content {
        grid-column: 3;
    }

    :host([start-column-count="2"]) ::slotted([slot="end"]) {
        grid-column: 4;
    }

    :host([start-column-count="2"]) .submenu-icon {
        grid-column: 5;
    }

    .content {
        justify-self: start;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    ::slotted([slot="checkbox-indicator"]),
    ::slotted([slot="radio-indicator"]),
    ::slotted([slot="submenu-icon"]) {
        display: flex;
        pointer-events: none;
    }

    .checkbox-indicator,
    .radio-indicator,
    .submenu-icon {
        display: flex;
        flex-basis: content;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    :host(:not([aria-checked="true"])) .checkbox-indicator,
    :host(:not([aria-checked="true"])) .radio-indicator {
        visibility: hidden;
    }

    .submenu-container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --col-width: minmax(20px, auto);
        margin: 0 calc(${designUnit} * 1px);
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        overflow: visible;
        padding: 0 12px;
        grid-column-gap: 8px;
        fill: currentcolor;
    }

    :host([aria-expanded="true"]) {
        background: ${neutralFillStealthActive};
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    ::slotted([slot="end"]:not(svg)) {
        color: ${neutralStrokeReadableRest};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
