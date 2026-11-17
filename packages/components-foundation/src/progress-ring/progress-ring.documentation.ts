import { defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { progressDocumentation } from "../progress/progress.documentation.js";

/**
 * Typed component documentation for the progress ring reference (`ProgressRing`).
 *
 * @public
 */
export const progressRingDocumentation = defineDocumentation({
    id: "progressRing",
    definition:
        "A **Progress Ring** is a circular progress indicator. It has the same range and value contract as a progress bar; the ring adds a background arc behind the indicator.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description:
            "Like a progress bar, either `determinate` or `indeterminate` is shown; the default ring indicator includes a `background` part.",
        parts: {
            determinate: {
                description: "Shown when `value` is known; holds the `determinate` slot and the default ring indicator.",
            },
            indeterminate: {
                description: "Shown when `value` is not known; holds the `indeterminate` slot and the default ring indicator.",
            },
            indicator: {
                description: "The arc that shows progress inside the visible container part.",
            },
            background: {
                description: "The circle behind the indicator arc in the default ring.",
            },
        },
    },
    contract: {
        include: [{ id: "progress", contract: progressDocumentation.contract }],
        properties: [],
        slots: [],
    },
});
