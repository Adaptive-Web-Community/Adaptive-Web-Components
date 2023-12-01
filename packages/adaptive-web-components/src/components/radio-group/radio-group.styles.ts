import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .positioning-region {
        display: flex;
        flex-wrap: wrap;
    }

    :host([orientation="vertical"]) .positioning-region {
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
