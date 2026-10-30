import { css, ElementStyles } from "@microsoft/fast-element";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        align-items: center;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        padding:
            calc(((${tokenVar(tokens.global.designUnit)} * 0.5) - ${tokenVar(tokens.shape.strokeThickness.default)}) * 1)
            calc((${tokenVar(tokens.global.designUnit)} - ${tokenVar(tokens.shape.strokeThickness.default)}) * 1);
    }
`;
