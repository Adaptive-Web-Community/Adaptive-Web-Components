import { css, ElementStyles } from "@microsoft/fast-element";
import {
    designUnit,
    strokeThickness,
} from "@adaptive-web/adaptive-ui/reference";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .control {
        padding:
            calc(((${designUnit} * 0.5) - ${strokeThickness}) * 1)
            calc((${designUnit} - ${strokeThickness}) * 1);
    }
`;
