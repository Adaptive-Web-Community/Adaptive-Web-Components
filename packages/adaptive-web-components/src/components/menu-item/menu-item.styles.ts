import {
    neutralFillStealth,
    neutralStrokeReadable,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

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

    :host(:not(:state(start-columns-1), :state(start-columns-2))) {
        grid-template-columns: 1fr auto var(--col-width);
    }

    :host(:not(:state(start-columns-1), :state(start-columns-2))) ::slotted([slot="end"]) {
        grid-column: 2;
    }

    :host(:not(:state(start-columns-1), :state(start-columns-2))) .submenu-icon {
        grid-column: 3;
    }

    /* managed columns: indicator OR start, content, end?, submenu? */

    :host(:state(start-columns-1)) {
        grid-template-columns: var(--col-width) 1fr auto var(--col-width);
    }

    :host(:state(start-columns-1)) .content {
        grid-column: 2;
    }

    :host(:state(start-columns-1)) ::slotted([slot="end"]) {
        grid-column: 3;
    }

    :host(:state(start-columns-1)) .submenu-icon {
        grid-column: 4;
    }

    /* managed columns: indicator, start, content, end?, submenu? */

    :host(:state(start-columns-2)) {
        grid-template-columns: var(--col-width) var(--col-width) 1fr auto var(--col-width);
    }

    :host(:state(start-columns-2)) ::slotted([slot="start"]) {
        grid-column: 2;
    }

    :host(:state(start-columns-2)) .content {
        grid-column: 3;
    }

    :host(:state(start-columns-2)) ::slotted([slot="end"]) {
        grid-column: 4;
    }

    :host(:state(start-columns-2)) .submenu-icon {
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

    .indicator,
    .submenu-icon {
        display: flex;
        flex-basis: content;
        align-items: center;
        justify-content: center;
        pointer-events: none;
    }

    .indicator[hidden],
    .submenu-icon[hidden] {
        display: none;
    }

    :host(:not(:state(checked))) .indicator {
        visibility: hidden;
    }

    :host(:state(disabled)) {
        cursor: default;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --col-width: minmax(20px, auto);
        overflow: visible;
    }

    :host(:state(expanded)) {
        background: ${neutralFillStealth.active};
    }

    ::slotted([slot="end"]:not(svg)) {
        color: ${neutralStrokeReadable.rest};
    }
`;
