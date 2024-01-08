import { css, ElementStyles } from "@microsoft/fast-element";
import {
    cornerRadiusControl,
    focusStrokeThickness,
    highlightStrokeReadableRest,
    neutralFillSubtleRest,
} from "@adaptive-web/adaptive-ui/reference";
import { heightNumber } from "../../styles/index.js";
import { DataGridRow } from "./data-grid-row.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css<DataGridRow>/* CSS */`
    :host {
        display: grid;
        grid-template-columns: subgrid;
        grid-column: span ${x => x.columnDefinitions?.length ?? 1 };
        grid-auto-flow: row;
        width: 100%;
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
        background-color: ${neutralFillSubtleRest};
    }

    :host([aria-selected="true"])::after {
        content: "";
        display: block;
        position: absolute;
        border-radius: ${cornerRadiusControl};
        background-color: ${highlightStrokeReadableRest};
        align-self: center;
        left: ${focusStrokeThickness};
        width: 3px;
        height: calc((${heightNumber} / 2) * 1px);
    }
`;
