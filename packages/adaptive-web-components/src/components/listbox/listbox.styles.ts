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
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host(:not([aria-multiselectable]):not([disabled]):focus-visible) ::slotted([aria-selected="true"][role="option"]:not([disabled])),
    :host([aria-multiselectable="true"]:not([disabled]):focus-visible) ::slotted([aria-checked="true"][role="option"]:not([disabled])) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
        outline-offset: 1px;
    }
`;
