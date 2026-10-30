import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";
import { visuallyHidden } from "../../styles/styles.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        align-items: center;
        user-select: none;
    }

    .label {
        cursor: pointer;
    }

    .label[hidden] {
        display: none;
    }

    .switch {
        display: flex;
        cursor: pointer;
    }

    :host(:state(checked)) .switch {
        justify-content: flex-end;
    }

    :host([hide-label]) .label {
        ${visuallyHidden}
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .switch {
        position: relative;
        width: calc(((${heightNumber} / 2)) * 2px + (${tokenVar(tokens.global.designUnit)} * 2));
        height: calc(((${heightNumber} / 2)) * 1px + ${tokenVar(tokens.global.designUnit)});
        padding: 4px;
    }

    .thumb {
        position: absolute;
        height: calc((${heightNumber}) * 1px - (${tokenVar(tokens.global.designUnit)} * 5.5));
        width: calc((${heightNumber}) * 1px - (${tokenVar(tokens.global.designUnit)} * 5.5));
        top: ${tokenVar(tokens.global.designUnit)};
        background: currentcolor;
        fill: currentcolor;
        transition: all 0.2s ease-in-out;
    }
`;
