import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralForegroundRest,
    neutralStrokeSubtleHover,
    neutralStrokeSubtleRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
        flex-direction: column;
        vertical-align: bottom;
        user-select: none;
        /* position: relative; */
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .label {
        display: block;
        cursor: pointer;
    }

    .control {
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
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        ${typeRampBase}
    }

    .label {
        margin-bottom: 4px;
    }

    .control {
        /* position: relative; */
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        box-sizing: border-box;
        height: calc(${heightNumber} * 2px);
        width: 100%;
        padding: calc(${designUnit} * 1.5px) calc(${designUnit} * 2px + 1px);
        background: ${neutralFillSubtleRest};
        color: ${neutralForegroundRest};
    }

    :host(:not([disabled]):hover) .control {
        background: ${neutralFillSubtleHover};
        border-color: ${neutralStrokeSubtleHover};
    }

    :host(:not([disabled]):focus-within) .control {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;
