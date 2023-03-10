import { accentFillRest, foregroundOnAccentRest, typeRampBase } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        position: relative;
        display: flex;
    }

    .backplate {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
    }

    ::slotted([slot="media"]) {
        position: absolute;
        display: block;
        max-width: 100%;
    }

    ::slotted(:not([slot])) {
        display: block;
    }

    ::slotted([slot="badge"]) {
        position: absolute;
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        max-width: calc(${heightNumber} * 1px);
        ${typeRampBase}
    }

    .backplate {
        border-radius: 100%;
        min-width: 100%;
        background-color: ${accentFillRest};
        color: ${foregroundOnAccentRest};
        fill: currentcolor;
    }

    ::slotted([slot="badge"]) {
        bottom: 0;
        right: 0;
    }
`;
