import {
    accentFillActive,
    accentFillHover,
    accentFillRest,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralStrokeStrongActive,
    neutralStrokeStrongHover,
    neutralStrokeStrongRest,
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
        align-items: center;
        user-select: none;
    }

    :host(:focus-visible) {
        outline: none;
    }

    .control {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
    }

    slot[name="checked-indicator"] *,
    slot[name="indeterminate-indicator"] * {
        /*opacity: 0;*/
        display: none;
        pointer-events: none;
    }

    :host([aria-checked="true"]) slot[name="checked-indicator"] *,
    :host([aria-checked="mixed"]) slot[name="indeterminate-indicator"] * {
        /*opacity: 1;*/
        display: flex;
    }

    .label {
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
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
        /* outline: none; */
    }

    .control {
        box-sizing: border-box;
        width: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        height: calc((${heightNumber} / 2 + ${designUnit}) * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeStrongRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillInputRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:enabled:hover) .control {
        background: ${neutralFillInputHover};
        border-color: ${neutralStrokeStrongHover};
    }

    :host(:enabled:active) .control {
        background: ${neutralFillInputActive};
        border-color: ${neutralStrokeStrongActive};
    }

    :host(:focus-visible) .control {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([aria-checked="true"]) .control,
    :host([aria-checked="mixed"]) .control {
        background: ${accentFillRest};
        border-color: transparent;
        color: ${foregroundOnAccentRest};
    }

    :host([aria-checked="true"]:not(.disabled):hover) .control,
    :host([aria-checked="mixed"]:not(.disabled):hover) .control {
        background: ${accentFillHover};
        border-color: transparent;
    }

    :host([aria-checked="true"]:not(.disabled):active) .control,
    :host([aria-checked="mixed"]:not(.disabled):active) .control {
        background: ${accentFillActive};
        border-color: transparent;
    }

    .label {
        padding-inline-start: calc(${designUnit} * 2px + 2px);
        color: ${neutralForegroundRest};
        ${typeRampBase}
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
