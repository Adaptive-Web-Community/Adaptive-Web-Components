import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: block;
    }

    .region {
        display: flex;
        z-index: 1000;
        overflow: auto;
    }

    .loaded {
        opacity: 1;
        pointer-events: none;
    }

    .loading-display,
    .no-options-display {
        display: flex;
        flex-direction: column;
        width: 100%;
        align-items: center;
        justify-items: center;
    }

    .bottom {
        flex-direction: column;
    }

    .top {
        flex-direction: column-reverse;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css``;

/**
 * Default Adaptive UI Picker styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
