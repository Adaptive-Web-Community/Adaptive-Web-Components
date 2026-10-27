import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    /* The element stays where it is in the page; its <dialog> is in the top layer. */
    :host {
        display: contents;
    }

    .control {
        --dialog-height: 480px;
        --dialog-width: 640px;
        width: var(--dialog-width);
        height: var(--dialog-height);
        max-width: 100%;
        max-height: 100%;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
`;
