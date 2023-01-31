import { css, ElementStyles } from "@microsoft/fast-element";
import { neutralForegroundRest, neutralStrokeDividerRest, strokeWidth, typeRampBase } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: flex;
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border-top: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
        color: ${neutralForegroundRest};
        ${typeRampBase}
    }
`;

/**
 * Default Adaptive UI Accordion styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
