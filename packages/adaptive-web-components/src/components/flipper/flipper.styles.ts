import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .next,
    .previous {
        display: flex;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        width: calc(${heightNumber} * 1px);
        height: calc(${heightNumber} * 1px);
        border-radius: 50% !important;
        padding: 0 !important;
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
