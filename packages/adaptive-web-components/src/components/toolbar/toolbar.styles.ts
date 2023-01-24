import { designUnit, focusStrokeWidth, neutralStrokeFocus } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Default Adaptive UI Toolbar styles.
 */
export const styles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        --toolbar-item-gap: calc(${designUnit} * 1px);
        display: inline-flex;
        fill: currentcolor;
        padding: var(--toolbar-item-gap);
        box-sizing: border-box;
        align-items: center;
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${neutralStrokeFocus};
    }

    .positioning-region {
        align-items: center;
        display: inline-flex;
        flex-flow: row wrap;
        justify-content: flex-start;
        flex-grow: 1;
    }

    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
        align-items: start;
    }

    ::slotted(:not([slot])) {
        flex: 0 0 auto;
        margin: 0 var(--toolbar-item-gap);
    }

    :host([orientation="vertical"]) ::slotted(:not([slot])) {
        margin: var(--toolbar-item-gap) 0;
    }

    :host([orientation="vertical"]) {
        display: inline-flex;
        flex-direction: column;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
        align-items: center;
    }

    ::slotted([slot="end"]) {
        margin-inline-start: auto;
    }
`;
