import { css, ElementStyles } from "@microsoft/fast-element";
import { SortableColumnHeader } from "./sortable-column-header.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: block;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css<SortableColumnHeader>`
    :host {
        box-sizing: border-box;
        height: 100%;
        width: 100%;
    }
    .active::part(control) {
        color: blue;
        background: brown;
    }
`;
