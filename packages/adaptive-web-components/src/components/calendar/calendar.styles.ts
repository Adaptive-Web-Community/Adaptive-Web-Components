import {
    accentFillReadableRest,
    cornerRadiusControl,
    designUnit,
    fillColor,
    neutralFillSubtleRest,
    neutralStrokeReadableRest,
    neutralStrokeStrongRest,
    strokeThickness,
} from "@adaptive-web/adaptive-ui/reference";
import { css, ElementStyles } from "@microsoft/fast-element";
import { baseHeightMultiplier, density } from "../../styles/index.js";

/**
 * Basic layout styling associated with the anatomy of the template.
 * @public
 */
export const templateStyles: ElementStyles = css`
    :host {
        display: inline-block;
    }

    .days {
        text-align: center;
    }

    .week-days,
    .week {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
    }

    .interact .day {
        cursor: pointer;
    }
`;

/**
 * Visual styles including Adaptive UI tokens.
 * @public
 */
export const aestheticStyles: ElementStyles = css`
    :host {
        --calendar-cell-size: calc((${baseHeightMultiplier} + 2 + ${density}) * ${designUnit});
        --calendar-gap: 2px;
    }

    .title {
        padding: ${designUnit};
        font-weight: 600;
    }

    .week-days,
    .week {
        grid-gap: var(--calendar-gap);
        border: 0;
        padding: 0;
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

    .inactive .date,
    .inactive.disabled::before {
        color: ${neutralStrokeReadableRest};
    }

    .disabled::before {
        content: "";
        display: inline-block;
        width: calc(var(--calendar-cell-size) * 0.8);
        height: ${strokeThickness};
        background: currentcolor;
        position: absolute;
        margin-top: calc(var(--calendar-cell-size) / 2);
        transform-origin: center;
        z-index: 1;
    }

    .selected {
        color: ${accentFillReadableRest};
        border: 1px solid ${accentFillReadableRest};
        background: ${fillColor};
    }

    .selected + .selected {
        border-start-start-radius: 0;
        border-end-start-radius: 0;
        border-inline-start-width: 0;
        padding-inline-start: calc(var(--calendar-gap) + ${strokeThickness} + ${cornerRadiusControl});
        margin-inline-start: calc((${cornerRadiusControl} * -1) - var(--calendar-gap));
    }

    .today.disabled::before {
        color: ${neutralStrokeStrongRest};
    }

    .today .date {
        color: ${neutralStrokeStrongRest};
        background: ${neutralFillSubtleRest};
        border-radius: 50%;
        position: relative;
    }
`;
