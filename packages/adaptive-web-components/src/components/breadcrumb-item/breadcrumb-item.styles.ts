import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
    }

    .listitem {
        display: flex;
        align-items: center;
    }

    .control {
        display: flex;
        align-items: center;
        white-space: nowrap;
    }

    :host([href]) .control {
        cursor: pointer;
    }

    .control[aria-current] {
        text-decoration: none;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]),
    .separator {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
