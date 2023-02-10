import { elevationFlyout, layerFillFixedPlus1 } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        box-sizing: border-box;
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        pointer-events: auto;
        z-index: 1000;
    }

    .suggestions-available-alert {
        height: 0;
        opacity: 0;
        overflow: hidden;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        border: calc(var(--stroke-width) * 1px) solid transparent;
        border-radius: calc(var(--control-corner-radius) * 1px);
        padding: calc(var(--design-unit) * 1px) 0;
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }
`;

/**
 * Default Adaptive UI Picker Menu styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;