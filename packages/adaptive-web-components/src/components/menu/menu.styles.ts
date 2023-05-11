import {
    designUnit,
    elevationFlyout,
    layerFillFixedPlus1,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";

/**
 * Basic layout styling associated with the anatomy of the template.
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
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        max-width: 368px;
        min-width: 64px;
        padding: calc(${designUnit} * 1px) 0;
        background: ${layerFillFixedPlus1};
        box-shadow: ${elevationFlyout};
    }

    :host([slot="submenu"]) {
        margin: 0 calc(${designUnit} * 1px);
    }

    ::slotted(adaptive-divider) {
        margin: 4px 0;
    }
`;
