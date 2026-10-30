import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }

    /* A menu that opens is a popover, below its button, or after its item for a submenu. */
    :host([popover]) {
        margin: 0;
        inset: auto;
        position-area: block-end span-inline-end;
        position-try-fallbacks: flip-block;
    }

    :host([slot="submenu"]) {
        width: max-content;
        position-area: inline-end span-block-end;
        position-try-fallbacks: flip-inline;
    }

    :host([popover]:not(:popover-open)) {
        display: none;
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
