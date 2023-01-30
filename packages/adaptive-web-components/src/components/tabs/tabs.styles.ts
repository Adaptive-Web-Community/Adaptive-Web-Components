import {
    accentFillRest,
    controlCornerRadius,
    neutralForegroundRest,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

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

    .active-indicator {
        grid-row: 2;
        grid-column: 1;
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

    :host([orientation="vertical"]) .activeIndicator {
        align-self: center;
        grid-column: 1;
        grid-row: 1;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        color: ${neutralForegroundRest};
    }

    .active-indicator {
        justify-self: center;
        width: 20px;
        height: 3px;
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${accentFillRest};
    }

`;

/**
 * Default Adaptive UI Tabs styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
