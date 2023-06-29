import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }

    :host([orientation="vertical"]) {
        height: 100%;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: content-box;
    }
`;
