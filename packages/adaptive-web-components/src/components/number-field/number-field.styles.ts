import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralStrokeActive,
    neutralStrokeHover,
    neutralStrokeRest,
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
        display: inline-block;
        user-select: none;
    }

    .label {
        display: block;
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .root {
        display: flex;
    }

    .control {
        -webkit-appearance: none;
        font: inherit;
        background: transparent;
        border: 0;
        color: inherit;
        margin-top: auto;
        margin-bottom: auto;
        border: none;
    }

    .control:focus-visible {
        outline: none;
    }

    .controls {
        opacity: 0;
    }

    :host(:enabled:hover) .controls,
    :host(:enabled:focus-within) .controls {
        opacity: 1;
    }

    .step-up,
    .step-down {
        display: flex;
        cursor: pointer;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
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
        color: ${neutralForegroundRest};
        margin-bottom: 4px;
    }

    .root {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        gap: 8px;
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillInputRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:enabled:hover) .root {
        background: ${neutralFillInputHover};
        border-color: ${neutralStrokeHover};
    }

    :host(:enabled:active) .root {
        background: ${neutralFillInputActive};
        border-color: ${neutralStrokeActive};
    }

    :host(:enabled:focus-within) .root {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    .control {
        height: calc(100% - 4px);
        padding: 0 calc(${designUnit} * 2px + 1px);
        font-size: inherit;
        line-height: inherit;
    }

    .step-up,
    .step-down {
        padding: 1px 10px;
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
