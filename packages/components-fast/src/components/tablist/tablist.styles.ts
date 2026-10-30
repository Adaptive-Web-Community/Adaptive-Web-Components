import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: flex;
        width: max-content;
    }

    :host([orientation="vertical"]) {
        flex-direction: column;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    ::slotted([selected])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: ${tokenVar(tokens.shape.cornerRadius.default)};
        background: ${tokenVar(tokens.color.highlight.stroke.readable)};
    }

    :host([orientation="horizontal"]) ::slotted([selected])::after {
        bottom: ${tokenVar(tokens.shape.strokeThickness.focus)};
        width: 20px;
        height: 3px;
    }

    :host([orientation="vertical"]) ::slotted([selected])::after {
        left: ${tokenVar(tokens.shape.strokeThickness.focus)};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
