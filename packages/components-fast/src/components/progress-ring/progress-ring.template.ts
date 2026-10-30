import { type ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { progressPercent, ProgressRingParts } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ProgressRing } from "./progress-ring.js";

/**
 * @public
 */
export const ProgressRingConditions = {
};

export { ProgressRingParts };

/**
 * @public
 */
export const ProgressRingAnatomy: ComponentAnatomy<typeof ProgressRingConditions, typeof ProgressRingParts> = {
    interactivity: Interactivity.never,
    conditions: ProgressRingConditions,
    parts: ProgressRingParts,
};

const indicator = html<ProgressRing>`
    <svg viewBox="0 0 16 16" class="progress">
        <circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle>
        <circle class="indicator" part="indicator" cx="8px" cy="8px" r="7px"></circle>
    </svg>
`;

/**
 * Default Progress Ring template. The percent complete is the `--percent-complete` custom property of the `determinate` part, for the styles.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<ProgressRing> =
    (ds: DesignSystem) => html<ProgressRing>`
        ${when(
            x => progressPercent(x) !== null,
            html<ProgressRing>`
                <span class="determinate" part="determinate" style="--percent-complete: ${x => progressPercent(x)}">
                    <slot name="determinate">${indicator}</slot>
                </span>
            `,
            html<ProgressRing>`
                <span class="indeterminate" part="indeterminate">
                    <slot name="indeterminate">${indicator}</slot>
                </span>
            `
        )}
    `;
