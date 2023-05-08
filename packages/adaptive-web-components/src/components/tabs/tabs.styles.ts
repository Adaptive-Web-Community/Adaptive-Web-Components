import {
    accentStrokeReadableRest,
    controlCornerRadius,
    focusStrokeWidth,
    neutralForegroundRest,
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
        grid-template-columns: auto 1fr auto;
        grid-template-rows: auto 1fr;
    }

    .tablist {
        position: relative;
        display: grid;
        grid-template-rows: auto auto;
        grid-template-columns: auto;
        width: max-content;
        align-self: end;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        align-self: center;
    }

    .tabpanel {
        position: relative;
        grid-row: 2;
        grid-column-start: 1;
        grid-column-end: 4;
    }

    :host([orientation="vertical"]) {
        grid-template-rows: auto 1fr auto;
        grid-template-columns: auto 1fr;
    }

    :host([orientation="vertical"]) .tablist {
        position: relative;
        width: max-content;
        width: 100%;
        display: grid;
        grid-row-start: 2;
        grid-row-end: 2;
        grid-template-rows: auto;
        grid-template-columns: auto 1fr;
        justify-self: end;
    }

    :host([orientation="vertical"]) .tabpanel {
        grid-column: 2;
        grid-row-start: 1;
        grid-row-end: 4;
    }

    :host([orientation="vertical"]) ::slotted([slot="end"]) {
        grid-row: 3;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        color: ${neutralForegroundRest};
    }

    ::slotted([role="tab"][aria-selected="true"])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${accentStrokeReadableRest};
    }

    :host([orientation="horizontal"]) ::slotted([role="tab"][aria-selected="true"])::after {
        bottom: calc(${focusStrokeWidth} * 1px);
        width: 20px;
        height: 3px;
    }

    :host([orientation="vertical"]) ::slotted([role="tab"][aria-selected="true"])::after {
        left: calc(${focusStrokeWidth} * 1px);
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
