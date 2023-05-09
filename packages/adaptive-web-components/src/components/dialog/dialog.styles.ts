import { css, ElementStyles } from "@microsoft/fast-element";
import { elevationDialog, fillColor } from "@adaptive-web/adaptive-ui";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
    }

    .overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        touch-action: none;
    }

    .control {
        position: relative;
        z-index: 1;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --dialog-height: 480px;
        --dialog-width: 640px;
        justify-content: center;
    }

    .overlay {
        background: rgba(0, 0, 0, 0.3);
    }

    .control {
        margin-top: auto;
        margin-bottom: auto;
        width: var(--dialog-width);
        height: var(--dialog-height);
        background: ${fillColor};
        box-shadow: ${elevationDialog};
    }
`;
