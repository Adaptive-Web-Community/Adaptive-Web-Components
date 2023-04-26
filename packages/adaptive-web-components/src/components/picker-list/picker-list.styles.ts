import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillSubtleActive,
    neutralFillSubtleHover,
    neutralFillSubtleRest,
    neutralForegroundRest,
    neutralStrokeSubtleActive,
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
        display: flex;
        flex-wrap: wrap;
        outline: none;
        user-select: none;
    }

    ::slotted([role="combobox"]) {
        box-sizing: border-box;
        width: auto;
        border: none;
        outline: none;
        user-select: none;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        min-height: calc(${heightNumber} * 1px);
        column-gap: calc(${designUnit} * 1px);
        row-gap: calc(${designUnit} * 1px);
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeSubtleRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillSubtleRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
        padding: calc(${designUnit} * 1px) calc(${designUnit} * 2px);
        ${typeRampBase}
    }

    :host(:not([disabled]):hover) {
        border-color: ${neutralStrokeSubtleHover};
        background: ${neutralFillSubtleHover};
    }

    :host(:not([disabled]):active) {
        border-color: ${neutralStrokeSubtleActive};
        background: ${neutralFillSubtleActive};
    }

    :host(:not([disabled]):focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }

    ::slotted([role="combobox"]) {
        height: calc(${heightNumber} * 1px);
        padding: 0 calc(${designUnit} * 2px + 1px);
    }
`;
