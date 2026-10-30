import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: grid;
        width: 100%;
        grid-template-columns: var(--data-grid-template-columns);
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }

    /* The cells are the row's grid items, generated or slotted. */
    .cells {
        display: contents;
    }

    :host([row-type="sticky-header"]) {
        position: sticky;
        top: 0;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host([row-type="sticky-header"]) {
        background-color: ${tokenVar(tokens.color.neutral.fill.subtle)};
    }

    :host([selected])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: ${tokenVar(tokens.shape.cornerRadius.default)};
        background-color: ${tokenVar(tokens.color.highlight.stroke.readable)};
        align-self: center;
        left: ${tokenVar(tokens.shape.strokeThickness.focus)};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
