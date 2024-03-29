import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }

    :host([slot="submenu"]) {
        width: max-content;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        max-width: 368px;
        min-width: 64px;
    }

    ::slotted(adaptive-divider) {
        margin: 4px 0;
    }
`;
