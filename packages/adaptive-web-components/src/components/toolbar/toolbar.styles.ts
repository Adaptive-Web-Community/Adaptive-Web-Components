import { focusStrokeWidth, neutralForegroundRest, neutralStrokeFocus } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-flex;
        align-items: center;
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
    }

    .positioning-region {
        display: inline-flex;
        flex-grow: 1;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
    }

    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
        align-items: start;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        gap: 8px;
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${neutralStrokeFocus};
    }

    .positioning-region {
        gap: 8px;
    }
`;

/**
 * Default Adaptive UI Toolbar styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
