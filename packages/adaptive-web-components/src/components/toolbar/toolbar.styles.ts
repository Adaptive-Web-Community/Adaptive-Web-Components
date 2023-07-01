import { neutralForegroundRest } from "@adaptive-web/adaptive-ui/migration";
import { focusStrokeOuter, focusStrokeThickness } from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
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
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        gap: 8px;
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:focus-visible) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }

    .positioning-region {
        gap: 8px;
    }
`;
