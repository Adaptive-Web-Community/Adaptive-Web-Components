import {
    focusStrokeOuter,
    focusStrokeThickness,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
        overflow-y: auto;
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
    :host(:focus-visible) ::slotted(:state(active)) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
        outline-offset: 1px;
    }
`;
