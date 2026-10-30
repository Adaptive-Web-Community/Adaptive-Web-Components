import { type ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { ProgressParts, progressPercent } from "@adaptive-web/components-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { Progress } from "./progress.js";

/**
 * @public
 */
export const ProgressConditions = {
};

export { ProgressParts };

/**
 * @public
 */
export const ProgressAnatomy: ComponentAnatomy<typeof ProgressConditions, typeof ProgressParts> = {
    interactivity: Interactivity.never,
    conditions: ProgressConditions,
    parts: ProgressParts,
};

/**
 * Default Progress template. The percent complete is the `--percent-complete` custom property of the `determinate` part, for the styles.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<Progress> =
    (ds: DesignSystem) => html<Progress>`
        ${when(
            x => progressPercent(x) !== null,
            html<Progress>`
                <span class="determinate" part="determinate" style="--percent-complete: ${x => progressPercent(x)}">
                    <slot name="determinate">
                        <div class="indicator" part="indicator"></div>
                    </slot>
                </span>
            `,
            html<Progress>`
                <span class="indeterminate" part="indeterminate">
                    <slot name="indeterminate">
                        <div class="indicator" part="indicator"></div>
                    </slot>
                </span>
            `
        )}
    `;
