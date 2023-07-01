import {
    focusStrokeOuter,
    focusStrokeThickness,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
        vertical-align: bottom;
        user-select: none;
        /* position: relative; */
    }

    .label.label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: block;
        cursor: pointer;
    }

    .control {
        font: inherit;
        resize: none;
    }

    :host([resize="both"]) .control {
        resize: both;
    }

    :host([resize="horizontal"]) .control {
        resize: horizontal;
    }

    :host([resize="vertical"]) .control {
        resize: vertical;
    }

    :host([disabled]) .label,
    :host([disabled]) .control {
        cursor: not-allowed;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    .label {
        margin-bottom: 4px;
    }

    .control {
        /* position: relative; */
        height: calc(${heightNumber} * 2px);
        width: 100%;
    }

    :host(:not([disabled]):focus-within) .control {
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
    }
`;
