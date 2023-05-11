import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
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
    :host {
        align-items: flex-start;
        flex-direction: column;
    }

    .positioning-region {
        gap: 8px;
    }
`;
