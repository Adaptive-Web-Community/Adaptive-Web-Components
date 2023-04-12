import {
    accentFillReadableActive,
    accentFillReadableHover,
    accentFillReadableRest,
    designUnit,
    fillColor,
    focusStrokeOuter,
    focusStrokeWidth,
    foregroundOnAccentActive,
    foregroundOnAccentHover,
    foregroundOnAccentRest,
    neutralFillSubtleActive,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralForegroundRest,
    neutralStrokeDiscernibleActive,
    neutralStrokeDiscernibleHover,
    neutralStrokeDiscernibleRest,
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

    :host([disabled]) .label,
    :host([disabled]) .switch {
        cursor: not-allowed;
    }

    .label {
        cursor: pointer;
    }

    .label__hidden {
        display: none;
        visibility: hidden;
    }

    .switch {
        display: flex;
        cursor: pointer;
    }

    :host([aria-checked="true"]) .switch {
        justify-content: flex-end;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        gap: 8px;
        ${typeRampBase}
    }

    .label {
        color: ${neutralForegroundRest};
    }

    .switch {
        position: relative;
        box-sizing: border-box;
        width: calc(((${heightNumber} / 2) + ${designUnit}) * 2px);
        height: calc(((${heightNumber} / 2) + ${designUnit}) * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeDiscernibleRest};
        border-radius: calc(${heightNumber} * 1px);
        padding: 4px;
        background: ${neutralFillSubtleRest};
    }

    :host(:enabled:hover) .switch {
        border-color: ${neutralStrokeDiscernibleHover};
        background: ${neutralFillSubtleHover};
    }

    :host(:enabled:active) .switch {
        border-color: ${neutralStrokeDiscernibleActive};
        background: ${neutralFillSubtleActive};
    }

    :host(:focus-visible) .switch {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    .thumb {
        position: absolute;
        height: calc((${heightNumber} - (${designUnit} * 5.5)) * 1px);
        width: calc((${heightNumber} - (${designUnit} * 5.5)) * 1px);
        top: calc(${designUnit} * 1px);
        background: ${neutralForegroundRest};
        border-radius: 50%;
        transition: all 0.2s ease-in-out;
    }

    :host([aria-checked="true"]) .thumb {
        background: ${foregroundOnAccentRest};
    }

    :host([aria-checked="true"]) .switch {
        background: ${accentFillReadableRest};
    }

    :host([aria-checked="true"]:enabled:hover) .switch {
        background: ${accentFillReadableHover};
    }

    :host([aria-checked="true"]:enabled:hover) .thumb {
        background: ${foregroundOnAccentHover};
    }

    :host([aria-checked="true"]:enabled:active) .switch {
        background: ${accentFillReadableActive};
    }

    :host([aria-checked="true"]:enabled:active) .thumb {
        background: ${foregroundOnAccentActive};
    }

    :host([aria-checked="true"]:enabled:focus-visible) .switch {
        box-shadow: 0 0 0 2px ${fillColor}, 0 0 0 4px ${focusStrokeOuter};
        border-color: transparent;
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
