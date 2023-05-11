import { ElementViewTemplate, html, when } from "@microsoft/fast-element";
import { FASTProgress, StaticallyComposableHTML, staticallyCompose } from "@microsoft/fast-foundation";
import { ComponentAnatomy, Interactivity } from "@adaptive-web/adaptive-ui";
import { DesignSystem } from "../../design-system.js";

/**
 * @public
 */
export const ProgressConditions = {
};

/**
 * @public
 */
export const ProgressParts = {
    indicator: "indicator",
    determinate: "determinate",
    indeterminate: "indeterminate",
};

/**
 * @public
 */
export const ProgressAnatomy: ComponentAnatomy<typeof ProgressConditions, typeof ProgressParts> = {
    interactivity: Interactivity.never,
    conditions: ProgressConditions,
    parts: ProgressParts,
};

// TODO: Temporary copy of template until https://github.com/microsoft/fast/pull/6286/

type ProgressOptions = {
    determinateIndicator?: StaticallyComposableHTML<FASTProgress>;
    indeterminateIndicator?: StaticallyComposableHTML<FASTProgress>;
};

const progressIndicatorTemplate = html`
    <div class="indicator" part="indicator"></div>
`;

/**
 * Default Progress template, {@link @microsoft/fast-foundation#progressTemplate}.
 * @public
 */
export const template: (ds: DesignSystem) => ElementViewTemplate<FASTProgress> =
    (ds: DesignSystem) => {
        const options: ProgressOptions = {
            determinateIndicator: progressIndicatorTemplate,
            indeterminateIndicator: progressIndicatorTemplate,
        };

        return html<FASTProgress>`
            <template
                role="progressbar"
                aria-valuenow="${x => x.value}"
                aria-valuemin="${x => x.min}"
                aria-valuemax="${x => x.max}"
            >
                ${when(
                    x => typeof x.value === "number",
                    html<FASTProgress>`
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
                    html<FASTProgress>`
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
