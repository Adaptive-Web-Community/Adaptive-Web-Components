import { css, ElementStyles } from "@microsoft/fast-element";
import {
    controlCornerRadius,
    designUnit,
    neutralFillSecondaryRest,
    neutralForegroundRest,
    strokeWidth,
    typeRampMinus1,
} from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: inline-block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        ${typeRampMinus1}
    }

    .control {
        border: calc(${strokeWidth} * 1px) solid transparent;
        border-radius: calc(${controlCornerRadius} * 1px);
        padding:
            calc(((${designUnit} * 0.5) - ${strokeWidth}) * 1px)
            calc((${designUnit} - ${strokeWidth}) * 1px);
        background: ${neutralFillSecondaryRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }
`;

/**
 * Default Adaptive UI Badge styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
