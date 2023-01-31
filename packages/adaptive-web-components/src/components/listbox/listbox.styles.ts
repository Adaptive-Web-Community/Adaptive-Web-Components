import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    layerFillFixedPlus1,
    neutralStrokeRest,
    strokeWidth,
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
        display: inline-flex;
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        box-sizing: border-box;
        padding: calc(${designUnit} * 1px) 0;
        background: ${layerFillFixedPlus1};
    }

    :host(:not([disabled]):focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;

/**
 * Default Adaptive UI Listbox styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
