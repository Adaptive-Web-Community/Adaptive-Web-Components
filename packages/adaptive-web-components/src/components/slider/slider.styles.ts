import { css, ElementStyles } from "@microsoft/fast-element";
import { visuallyHidden } from "../../styles/styles.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-grid;
        align-items: center;
        user-select: none;
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

    :host(:disabled),
    :host([readonly]) {
        cursor: default;
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

    :host(:state(dragging)) .thumb-container,
    :host(:state(dragging)) .track-start {
        transition: none;
    }

    /* The value's place, in the writing direction, centered on the thumb. */
    :host([orientation="horizontal"]) .thumb-container {
        inset-inline-start: calc(var(--slider-position) * 1%);
        margin-inline-start: calc(var(--thumb-size) * -0.5);
    }

    :host([orientation="vertical"]) .thumb-container {
        bottom: calc(var(--slider-position) * 1%);
        margin-bottom: calc(var(--thumb-size) * -0.5);
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
        inset-inline-start: 0;
        width: calc(var(--slider-position) * 1%);
    }

    :host([orientation="vertical"]) .track-start {
        width: 100%;
        bottom: 0;
        height: calc(var(--slider-position) * 1%);
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

    .label {
        justify-self: start;
    }

    .label[hidden] {
        display: none;
    }

    :host([hide-label]) .label {
        ${visuallyHidden}
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --thumb-size: 16px;
        --track-width: ${tokenVar(tokens.global.designUnit)};
        --track-overhang: calc((${tokenVar(tokens.global.designUnit)} / 2) * -1);
        margin: ${tokenVar(tokens.global.designUnit)} 0;
    }

    :host([orientation="horizontal"]) .positioning-region {
        margin: 0 8px;
    }

    :host([orientation="vertical"]) .positioning-region {
        margin: 0 8px;
    }
`;
