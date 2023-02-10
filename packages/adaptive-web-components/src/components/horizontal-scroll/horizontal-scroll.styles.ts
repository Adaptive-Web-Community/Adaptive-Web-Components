import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        position: relative;
        display: block;
        contain: layout;
    }

    .scroll-view {
        overflow-x: auto;
        scrollbar-width: none;
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .content {
        position: relative;
        display: inline-flex;
        flex-wrap: nowrap;
        align-items: center;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    .scroll-view {
        padding: 4px;
    }

    .content {
        gap: 8px;
    }
`;

/**
 * Default Adaptive UI Horizontal Scroll styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;

/**
 * Styling for interaction on non-mobile view.
 */
export const actionsStyles = css`
    .scroll-area {
        position: relative;
    }

    .scroll-view {
        overflow-x: hidden !important;
    }

    .scroll {
        position: absolute;
        display: flex;
        align-items: center;
        top: 0;
        bottom: 0;
        user-select: none;
    }

    .scroll.disabled {
        display: none;
    }

    .scroll-previous {
        right: auto;
        left: 0;
    }

    .scroll-next {
        left: auto;
        right: 0;
    }
`;