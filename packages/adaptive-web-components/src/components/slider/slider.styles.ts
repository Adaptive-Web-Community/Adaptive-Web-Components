import {
    accentForegroundRest,
    neutralForegroundRest,
} from "@adaptive-web/adaptive-ui/migration";
import {
    designUnit,
    focusStrokeOuter,
    focusStrokeThickness,
    neutralStrokeDiscernibleRest,
    neutralStrokeSubtleActive,
    neutralStrokeSubtleHover,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { heightNumber } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
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
        min-width: var(--thumb-size);
        touch-action: pan-y;
    }

    :host([orientation="vertical"]) {
        height: 100%;
        min-height: var(--thumb-size);
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
        grid-template-rows: var(--thumb-size) 1fr;
    }

    :host([orientation="vertical"]) .positioning-region {
        height: 100%;
        grid-template-columns: var(--thumb-size) 1fr;
    }

    .thumb-container {
        position: absolute;
        height: var(--thumb-size);
        width: var(--thumb-size);
        transition: all 0.2s ease;
    }

    :host([orientation="horizontal"]) .thumb-container {
        transform: translateX(calc(var(--thumb-size) * 0.5));
    }

    :host([orientation="vertical"]) .thumb-container {
        transform: translateY(calc(var(--thumb-size) * -0.5));
    }

    .thumb {
        width: var(--thumb-size);
        height: var(--thumb-size);
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
        right: var(--track-overhang);
        left: var(--track-overhang);
        align-self: center;
        height: var(--track-width);
    }

    :host([orientation="vertical"]) .track {
        top: var(--track-overhang);
        bottom: var(--track-overhang);
        justify-self: center;
        height: 100%;
        width: var(--track-width);
    }

`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --thumb-size: calc((${heightNumber} * 0.5) * 1px);
        --track-width: ${designUnit};
        --track-overhang: calc((${designUnit} / 2) * -1);
        margin: ${designUnit} 0;
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
        outline: ${focusStrokeThickness} solid ${focusStrokeOuter};
        outline-offset: 2px;
    }

    .track-start {
        background: ${accentForegroundRest};
    }

    .track {
        background: ${neutralStrokeDiscernibleRest};
    }

    :host([disabled]) {
        opacity: 0.3;
    }
`;
