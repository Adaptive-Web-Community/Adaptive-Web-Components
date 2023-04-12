import {
    accentForegroundRest,
    controlCornerRadius,
    designUnit,
    focusStrokeOuter,
    focusStrokeWidth,
    neutralForegroundRest,
    neutralStrokeDiscernibleRest,
    neutralStrokeSubtleActive,
    neutralStrokeSubtleHover,
} from "@adaptive-web/adaptive-ui";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-grid;
        align-items: center;
        user-select: none;
        outline: none;
        cursor: pointer;
    }

    :host([orientation="horizontal"]) {
        width: 100%;
        min-width: calc(var(--thumb-size) * 1px);
        touch-action: pan-y;
    }

    :host([orientation="vertical"]) {
        height: 100%;
        min-height: calc(var(--thumb-size) * 1px);
        touch-action: pan-x;
    }

    :host([disabled]) {
        cursor: not-allowed;
    }

    .positioning-region {
        position: relative;
        display: grid;
    }

    :host([orientation="horizontal"]) .positioning-region {
        grid-template-rows: calc(var(--thumb-size) * 1px) 1fr;
    }

    :host([orientation="vertical"]) .positioning-region {
        height: 100%;
        grid-template-columns: calc(var(--thumb-size) * 1px) 1fr;
    }

    .thumb-container {
        position: absolute;
        height: calc(var(--thumb-size) * 1px);
        width: calc(var(--thumb-size) * 1px);
        transition: all 0.2s ease;
    }

    :host([orientation="horizontal"]) .thumb-container {
        transform: translateX(calc(var(--thumb-size) * 0.5px)) translateY(calc(var(--thumb-translate) * 1px));
    }

    :host([orientation="vertical"]) .thumb-container {
        transform: translateX(calc(var(--thumb-translate) * 1px)) translateY(calc(var(--thumb-size) * -0.5px));
    }

    .thumb {
        width: calc(var(--thumb-size) * 1px);
        height: calc(var(--thumb-size) * 1px);
    }

    .track-start {
        position: absolute;
    }

    :host([orientation="horizontal"]) .track-start {
        height: 100%;
        left: 0;
    }

    :host([orientation="vertical"]) .track-start {
        width: 100%;
        bottom: 0;
    }

    .track {
        position: absolute;
    }

    :host([orientation="horizontal"]) .track {
        right: calc(var(--track-overhang) * 1px);
        left: calc(var(--track-overhang) * 1px);
        align-self: start;
        height: calc(var(--track-width) * 1px);
    }

    :host([orientation="vertical"]) .track {
        top: calc(var(--track-overhang) * 1px);
        bottom: calc(var(--track-overhang) * 1px);
        height: 100%;
        width: calc(var(--track-width) * 1px);
    }

`;

/**
 * Visual styles including Adaptive UI tokens.
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --thumb-size: calc(${heightNumber} * 0.5);
        --thumb-translate: calc(var(--thumb-size) * -0.5 + var(--track-width) / 2);
        --track-overhang: calc((${designUnit} / 2) * -1);
        --track-width: ${designUnit};
        margin: calc(${designUnit} * 1px) 0;
        border-radius: calc(${controlCornerRadius} * 1px);
    }

    :host([orientation="horizontal"]) .positioning-region {
        margin: 0 8px;
    }

    :host([orientation="vertical"]) .positioning-region {
        margin: 0 8px;
    }

    .thumb {
        border: none;
        border-radius: 50%;
        background: ${neutralForegroundRest};
    }

    .thumb:hover {
        border-color: ${neutralStrokeSubtleHover};
        background: ${neutralForegroundRest};
    }

    .thumb:active {
        border-color: ${neutralStrokeSubtleActive};
        background: ${neutralForegroundRest};
    }

    :host(:focus-visible) .thumb {
        outline: calc(${focusStrokeWidth} * 1px) solid ${focusStrokeOuter};
        outline-offset: 2px;
    }

    .track-start {
        border-radius: calc(${controlCornerRadius} * 1px);
        background: ${accentForegroundRest};
    }

    .track {
        background: ${neutralStrokeDiscernibleRest};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
