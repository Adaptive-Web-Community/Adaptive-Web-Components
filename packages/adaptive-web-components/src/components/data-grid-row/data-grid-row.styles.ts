import { css, ElementStyles } from "@microsoft/fast-element";
import {
    cornerRadiusControl,
    focusStrokeThickness,
    highlightStrokeReadable,
    neutralFillSubtle,
} from "@adaptive-web/adaptive-ui/reference";
import { heightNumber } from "../../styles/index.js";

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
        background-color: ${neutralFillSubtle.rest};
    }

    :host([selected])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: ${cornerRadiusControl};
        background-color: ${highlightStrokeReadable.rest};
        align-self: center;
        left: ${focusStrokeThickness};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
