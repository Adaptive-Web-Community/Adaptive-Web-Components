import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { FASTProgressRing, StaticallyComposableHTML, staticallyCompose } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

export const ProgressRingConditions = {
};

export const ProgressRingParts = {
    indicator: "indicator",
    determinate: "determinate",
    indeterminate: "indeterminate",
};

export const ProgressRingAnatomy: ComponentAnatomy<typeof ProgressRingConditions, typeof ProgressRingParts> = {
    interactivity: Interactivity.never,
    conditions: ProgressRingConditions,
    parts: ProgressRingParts,
};

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

type ProgressRingOptions = {
    determinateIndicator?: StaticallyComposableHTML<FASTProgressRing>;
    indeterminateIndicator?: StaticallyComposableHTML<FASTProgressRing>;
};

const progressRingIndicatorTemplate = html`
    <svg viewBox="0 0 16 16" class="progress">
        <circle class="background" part="background" cx="8px" cy="8px" r="7px"></circle>
        <circle class="indicator" part="indicator" cx="8px" cy="8px" r="7px"></circle>
    </svg>
`;

/**
 * Default Progress template, {@link @microsoft/fast-foundation#progressTemplate}.
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTProgressRing> =
    (ds: DesignSystem) => {
        const options: ProgressRingOptions = {
            determinateIndicator: progressRingIndicatorTemplate,
            indeterminateIndicator: progressRingIndicatorTemplate,
        };

        return html<FASTProgressRing>`
            <template
                role="progressbar"
                aria-valuenow="${x => x.value}"
                aria-valuemin="${x => x.min}"
                aria-valuemax="${x => x.max}"
            >
                ${when(
                    x => typeof x.value === "number",
                    html<FASTProgressRing>`
                        <span
                            class="determinate"
                            part="determinate"
                            style="--percent-complete: ${x => x.percentComplete}"
                        >
                            <slot name="determinate">
                                ${staticallyCompose(options.determinateIndicator)}
                            </slot>
                        </span>
                    `
                )}
                ${when(
                    x => typeof x.value !== "number",
                    html<FASTProgressRing>`
                        <span class="indeterminate" part="indeterminate">
                            <slot name="indeterminate">
                                ${staticallyCompose(options.indeterminateIndicator)}
                            </slot>
                        </span>
                    `
                )}
            </template>
        `;
    };
