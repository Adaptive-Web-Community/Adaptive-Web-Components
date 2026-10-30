import { css, ElementStyles } from "@microsoft/fast-element";
import { visuallyHidden } from "../../styles/styles.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
        vertical-align: bottom;
        user-select: none;
    }

    .label[hidden] {
        display: none;
    }

    .label {
        align-self: start;
        cursor: pointer;
    }

    .control {
        font: inherit;
        resize: none;
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    :host([hide-label]) .label {
        ${visuallyHidden}
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
