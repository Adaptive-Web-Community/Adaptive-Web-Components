import {
    accentFillReadableActive,
    accentFillReadableHover,
    accentFillReadableRest,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentRest,
    neutralFillSubtleActive,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralForegroundRest,
    neutralStrokePerceivableActive,
    neutralStrokePerceivableHover,
    neutralStrokePerceivableRest,
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

    slot[name="checked-indicator"] * {
        pointer-events: none;
    }

    slot[name="checked-indicator"] * {
        /*opacity: 0;*/
        display: none;
    }

    :host([aria-checked="true"]) slot[name="checked-indicator"] * {
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
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokePerceivableRest};
        border-radius: 50%;
        background: ${neutralFillSubtleRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
    }

    :host(:enabled:hover) .control {
        background: ${neutralFillSubtleHover};
        border-color: ${neutralStrokePerceivableHover};
    }

    :host(:enabled:active) .control {
        background: ${neutralFillSubtleActive};
        border-color: ${neutralStrokePerceivableActive};
    }

    :host(:focus-visible) .control {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    :host([aria-checked="true"]) .control {
        background: ${accentFillReadableRest};
        border-color: transparent;
        color: ${foregroundOnAccentRest};
    }

    :host([aria-checked="true"]:not(.disabled):hover) .control {
        background: ${accentFillReadableHover};
        border-color: transparent;
    }

    :host([aria-checked="true"]:not(.disabled):active) .control {
        background: ${accentFillReadableActive};
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
