import { css, ElementStyles } from "@microsoft/fast-element";
import { neutralFillRest, neutralStrokeDividerRest, strokeWidth } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: grid;
        box-sizing: border-box;
        width: 100%;
    }

    :host([cell-type="sticky-header"]) {
        position: sticky;
        top: 0;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        padding: 1px 0;
        border-bottom: calc(${strokeWidth} * 1px) solid ${neutralStrokeDividerRest};
    }

    :host([cell-type="sticky-header"]) {
        background: ${neutralFillRest};
    }
`;

/**
 * Default Adaptive UI Data Grid Row styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
