import { css, ElementStyles } from "@microsoft/fast-element";
import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralForegroundRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        overflow: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border: transparent calc(${strokeWidth} * 1px) solid;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding: calc(${designUnit} * 1px) calc(${designUnit} * 3px);
        color: ${neutralForegroundRest};
        fill: currentcolor;
        ${typeRampBase}
        white-space: nowrap;
    }

    :host([cell-type="column-header"]) {
        font-weight: 600;
    }

    :host(:focus-visible) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;

/**
 * Default Adaptive UI Data Grid Cell styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
