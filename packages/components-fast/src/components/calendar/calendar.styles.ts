import { css, ElementStyles } from "@microsoft/fast-element";
import { baseHeightMultiplier, density } from "../../styles/index.js";
import { visuallyHidden } from "../../styles/styles.js";
import { tokens, tokenVar } from "../../styles/tokens.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
    }

    .header {
        display: flex;
        align-items: center;
    }

    .title {
        flex: 1;
        text-align: center;
    }

    .previous-month,
    .next-month {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        /* reset */
        background: transparent;
        border: none;
        color: inherit;
        font: inherit;
        padding: unset;
    }

    .previous-month:disabled,
    .next-month:disabled {
        cursor: default;
    }

    .days {
        border-collapse: separate;
        text-align: center;
    }

    .day {
        position: relative;
        cursor: pointer;
    }

    :host([readonly]) .day,
    .day[aria-disabled="true"] {
        cursor: default;
    }

    .label {
        display: block;
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
        --calendar-cell-size: calc((${baseHeightMultiplier} + 2 + ${density}) * ${tokenVar(tokens.global.designUnit)});
        --calendar-gap: 2px;
    }

    .title {
        padding: ${tokenVar(tokens.global.designUnit)};
        font-weight: 600;
    }

    .days {
        border-spacing: var(--calendar-gap);
    }

    .day,
    .week-day {
        border: 0;
        width: var(--calendar-cell-size);
        height: var(--calendar-cell-size);
        line-height: var(--calendar-cell-size);
        padding: 0;
        box-sizing: initial;
    }

    .week-day {
        font-weight: 600;
    }

    .date {
        height: 100%;
    }

    .day[data-outside] .date,
    .day[data-outside][aria-disabled="true"]::before {
        color: ${tokenVar(tokens.color.neutral.stroke.readable)};
    }

    .day[aria-disabled="true"]::before {
        content: "";
        display: inline-block;
        width: calc(var(--calendar-cell-size) * 0.8);
        height: ${tokenVar(tokens.shape.strokeThickness.default)};
        background: currentcolor;
        position: absolute;
        margin-top: calc(var(--calendar-cell-size) / 2);
        transform-origin: center;
        z-index: 1;
    }

    .day[aria-selected="true"] {
        color: ${tokenVar(tokens.color.accent.fill.readable)};
        border: 1px solid ${tokenVar(tokens.color.accent.fill.readable)};
        background: ${tokenVar(tokens.color.context)};
    }

    .day[aria-selected="true"] + .day[aria-selected="true"] {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
        border-inline-start-width: 0;
        padding-inline-start: calc(var(--calendar-gap) + ${tokenVar(tokens.shape.strokeThickness.default)} + ${tokenVar(tokens.shape.cornerRadius.default)});
        margin-inline-start: calc((${tokenVar(tokens.shape.cornerRadius.default)} * -1) - var(--calendar-gap));
    }

    .day[aria-current="date"][aria-disabled="true"]::before {
        color: ${tokenVar(tokens.color.neutral.stroke.strong)};
    }

    .day[aria-current="date"] .date {
        color: ${tokenVar(tokens.color.neutral.stroke.strong)};
        background: ${tokenVar(tokens.color.neutral.fill.subtle)};
        border-radius: 50%;
        position: relative;
    }
`;
