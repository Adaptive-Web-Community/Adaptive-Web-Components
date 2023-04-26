import { designUnit } from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { density } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        padding: 0 calc((6 + (${designUnit} * 2 * ${density})) * 1px);
    }
`;
