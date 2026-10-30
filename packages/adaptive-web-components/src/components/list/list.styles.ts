import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
    }

    :host([orientation="horizontal"]) {
        flex-direction: row;
        overflow-x: auto;
    }

    :host([orientation="horizontal"]) ::slotted(*) {
        flex-shrink: 0;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css``;
