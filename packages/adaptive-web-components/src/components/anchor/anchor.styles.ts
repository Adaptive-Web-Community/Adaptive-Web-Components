import {
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralFillSubtleControlStyles,
    renderElementStyles,
    strokeWidth,
    typeRampBase,
} from "@adaptive-web/adaptive-ui";
import type { StyleModuleEvaluateParameters } from "@adaptive-web/adaptive-ui";
import { css } from "@microsoft/fast-element";
import type { ElementStyles } from "@microsoft/fast-element";
import { density, heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-flex;
    }

    .control {
        display: inline-flex;
        flex-grow: 1;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
        outline: none;
        text-decoration: none;
    }

    .control::-moz-focus-inner {
        border: 0;
    }

    ::slotted([slot="start"]),
    ::slotted([slot="end"]) {
        display: flex;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        box-sizing: border-box;
        height: calc(${heightNumber} * 1px);
        min-width: calc(${heightNumber} * 1px);
        ${typeRampBase}
    }

    .control {
        border: calc(${strokeWidth} * 1px) solid transparent;
        gap: 10px;
        padding: 0 calc((10 + (${designUnit} * 2 * ${density})) * 1px);
        border-radius: calc(${controlCornerRadius} * 1px);
        fill: currentcolor;
    }

    .control.icon-only {
        padding: 0;
        line-height: 0;
    }

    .control:focus-visible {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
    }
`;

const moduleParams: StyleModuleEvaluateParameters = {
    part: "control",
    interactivitySelector: "[href]",
    nonInteractivitySelector: ":not([href])",
};

/**
 * Visual styles composed by modules.
 * 
 * @internal
 */
export const moduleStyles = renderElementStyles(neutralFillSubtleControlStyles, moduleParams);
