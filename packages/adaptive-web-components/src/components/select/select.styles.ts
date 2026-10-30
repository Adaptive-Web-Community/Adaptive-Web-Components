import { focusStrokeOuter, focusStrokeThickness } from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { visuallyHidden } from "../../styles/styles.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
        user-select: none;
        vertical-align: top;
    }

    .control {
        display: flex;
        align-items: center;
        cursor: pointer;
        width: 100%;
    }

    :host(:disabled) .control {
        cursor: default;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .indicator {
        display: flex;
    }

    .selected-value {
        flex: 1 1 auto;
    }

    .indicator {
        flex: 0 0 auto;
    }

    .listbox {
        margin: 0;
        inset: auto;
        position-area: block-end span-inline-end;
        position-try-fallbacks: flip-block;
        min-width: anchor-size(width);
        max-height: 50vh;
        overflow-y: auto;
    }

    .listbox:popover-open {
        display: flex;
        flex-direction: column;
    }

    ::slotted(*) {
        flex: 0 0 auto;
    }

    .label {
        align-self: start;
        cursor: pointer;
    }

    .label[hidden] {
        display: none;
    }

    :host([hide-label]) .label {
        ${visuallyHidden}
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
