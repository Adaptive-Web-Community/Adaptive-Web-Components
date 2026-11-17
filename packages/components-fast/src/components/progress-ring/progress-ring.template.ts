import { type ElementViewTemplate, html, when } from "@microsoft/fast-element";
import {
    progressPercent,
    progressRingDocumentation,
    ProgressRingParts,
    ProgressRingSlots,
    progressRingWebBinding,
} from "@adaptive-web/components-foundation";
import { documentationToComponentAnatomy } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";
import type { ProgressRing } from "./progress-ring.js";

/**
 * @public
 */
export const ProgressRingAnatomy = documentationToComponentAnatomy(progressRingDocumentation, progressRingWebBinding);

const indicator = html<ProgressRing>`
    <svg viewBox="0 0 16 16" class="progress">
        <circle class=${(_) => ProgressRingParts.background} part=${(_) => ProgressRingParts.background} cx="8px" cy="8px" r="7px"></circle>
        <circle class=${(_) => ProgressRingParts.indicator} part=${(_) => ProgressRingParts.indicator} cx="8px" cy="8px" r="7px"></circle>
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
                <span class=${(_) => ProgressRingParts.determinate} part=${(_) => ProgressRingParts.determinate} style="--percent-complete: ${x => progressPercent(x)}">
                    <slot name=${(_) => ProgressRingSlots.determinate}>${indicator}</slot>
                </span>
            `,
            html<ProgressRing>`
                <span class=${(_) => ProgressRingParts.indeterminate} part=${(_) => ProgressRingParts.indeterminate}>
                    <slot name=${(_) => ProgressRingSlots.indeterminate}>${indicator}</slot>
                </span>
            `,
        )}
    `;
