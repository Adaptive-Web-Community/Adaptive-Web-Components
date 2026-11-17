import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link ProgressElement}.
 *
 * @public
 */
export const progressDocumentation = defineDocumentation({
    id: "progress",
    definition:
        'A **Progress** indicator shows how much of a task is done (`role="progressbar"`), between a minimum and maximum, or that work is ongoing when the value is not known.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description:
            "The host is the progress bar; either the `determinate` or `indeterminate` part is shown from whether `value` is known.",
        parts: {
            determinate: {
                description: "Shown when `value` is known; holds the `determinate` slot and the default indicator.",
            },
            indeterminate: {
                description: "Shown when `value` is not known; holds the `indeterminate` slot and the default indicator.",
            },
            indicator: {
                description: "What shows the progress inside the visible container part.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "value",
                kind: ContractPropertyKind.number,
                nullable: true,
                description:
                    "How much is done, or no value when progress is not known (indeterminate). Not styled as a condition.",
            },
            {
                id: "min",
                kind: ContractPropertyKind.number,
                description: "The value at which nothing is done. The default is 0.",
            },
            {
                id: "max",
                kind: ContractPropertyKind.number,
                description: "The value at which all is done. The default is 100.",
            },
        ],
        slots: [
            {
                id: "determinate",
                description: "Replaces the default indicator when progress is determinate.",
            },
            {
                id: "indeterminate",
                description: "Replaces the default indicator when progress is indeterminate.",
            },
        ],
    },
    accessibility: {
        summary:
            "An indeterminate progress has no value for assistive technology, so the author names it (`aria-label`), as for any progress.",
    },
});
