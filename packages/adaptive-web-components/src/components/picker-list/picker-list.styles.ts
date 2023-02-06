import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillInputActive,
    neutralFillInputHover,
    neutralFillInputRest,
    neutralForegroundRest,
    neutralStrokeInputActive,
    neutralStrokeInputHover,
    neutralStrokeInputRest,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host([hidden]) {
        display: none;
    }

    :host {
        display: flex;
        flex-wrap: wrap;
    }

    ::slotted([role="combobox"]) {
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
    }

    ::slotted([role="combobox"]) {
        /* box-sizing: border-box; */
        /* width: auto; */
        border: calc(${strokeWidth} * 1px) solid ${neutralStrokeInputRest};
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${neutralFillInputRest};
        color: ${neutralForegroundRest};
        fill: currentcolor;
        padding: 0 calc(${designUnit} * 2px + 1px);
        ${typeRampBase}
    }

    ::slotted([role="combobox"]:hover) {
        border-color: ${neutralStrokeInputHover};
        background: ${neutralFillInputHover};
    }

    ::slotted([role="combobox"]:active) {
        border-color: ${neutralStrokeInputActive};
        background: ${neutralFillInputActive};
    }

    ::slotted([role="combobox"]:focus-within) {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;

/**
 * Default Adaptive UI Picker List Item styles.
 */
export const styles: ElementStyles = css`
    ${templateStyles}

    ${aestheticStyles}
`;
