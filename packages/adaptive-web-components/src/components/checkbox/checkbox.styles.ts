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
    }

    .control {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    slot[name$="-indicator"] * {
        display: flex;
        pointer-events: none;
    }

    .label {
        cursor: pointer;
    }

    .label[hidden] {
        display: none;
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
    .control {
        width: calc((${heightNumber} / 2) * 1px + ${tokenVar(tokens.global.designUnit)});
        height: calc((${heightNumber} / 2) * 1px + ${tokenVar(tokens.global.designUnit)});
    }
`;
