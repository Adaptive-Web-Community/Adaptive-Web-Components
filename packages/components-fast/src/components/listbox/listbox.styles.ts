import { css, ElementStyles } from "@microsoft/fast-element";
import { visuallyHidden } from "../../styles/styles.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
    }

    .options {
        display: flex;
        flex-direction: column;
        flex: 1 1 auto;
        min-height: 0;
        overflow-y: auto;
    }

    ::slotted(*) {
        flex: 0 0 auto;
    }

    .label {
        align-self: start;
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
    :host(:focus-visible) ::slotted(:state(active)) {
        outline: ${tokenVar(tokens.shape.strokeThickness.focus)} solid ${tokenVar(tokens.color.focusStroke.outer)};
        outline-offset: 1px;
    }
`;
