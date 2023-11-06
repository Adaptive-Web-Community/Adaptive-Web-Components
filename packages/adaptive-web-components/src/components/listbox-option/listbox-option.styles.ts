import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        align-items: center;
        overflow: hidden;
        user-select: none;
        white-space: nowrap;
        cursor: pointer;
    }

    /* Keep for now, show on full component not just children */
    :host([disabled]) {
        cursor: not-allowed;
    }

    .content {
        /* justify-self: start; */
        overflow: hidden;
        text-overflow: ellipsis;
        flex-grow: 1;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
