import { css, ElementStyles } from "@microsoft/fast-element";
import { visuallyHidden } from "../../styles/styles.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }

    :host(:not(:disabled)) {
        cursor: pointer;
    }

    :host([hide-label]) .content {
        ${visuallyHidden}
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
