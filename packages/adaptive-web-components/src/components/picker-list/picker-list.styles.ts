import {
    densityControl,
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
        display: flex;
        flex-wrap: wrap;
        outline: none;
        user-select: none;
    }

    ::slotted([role="combobox"]) {
        width: auto;
        border: none;
        outline: none;
        user-select: none;
        font: inherit;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host(:not([disabled]):focus-within) {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }

    ::slotted([role="combobox"]) {
        padding: ${densityControl.verticalPadding} ${densityControl.horizontalPadding};
    }
`;
