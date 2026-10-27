import { focusStrokeOuter, focusStrokeThickness } from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        vertical-align: top;
    }

    .root {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        width: 100%;
        cursor: text;
    }

    .values:not([hidden]) {
        display: contents;
    }

    [part~="value"] {
        display: inline-flex;
        align-items: center;
        max-width: 100%;
    }

    [part~="value-label"] {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    [part~="value-remove"] {
        display: inline-flex;
        cursor: pointer;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
    }

    .control {
        flex: 1 1 4em;
        min-width: 4em;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
    }

    .control:focus {
        outline: none;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .indicator {
        display: flex;
    }

    .popup {
        margin: 0;
        inset: auto;
        position-area: block-end span-inline-end;
        position-try-fallbacks: flip-block;
        min-width: anchor-size(width);
        max-height: 50vh;
        overflow-y: auto;
    }

    .popup:popover-open,
    .listbox {
        display: flex;
        flex-direction: column;
    }

    ::slotted(*) {
        flex: 0 0 auto;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    ::slotted(:state(active)) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
        outline-offset: calc(${focusStrokeThickness} * -1);
    }
`;
