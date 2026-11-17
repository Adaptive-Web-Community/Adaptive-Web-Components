import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";

/**
 * Typed component documentation for {@link SliderLabelElement}.
 *
 * @public
 */
export const sliderLabelDocumentation = defineDocumentation({
    id: "sliderLabel",
    definition:
        "A **Slider Label** marks a value along a slider track, with an optional mark. Its slider gives where it is and its orientation.",
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description: "The `container` part is placed with `--slider-label-position` along the track.",
        parts: {
            container: {
                description: "Holds the mark and content, positioned along the track.",
            },
            mark: {
                description: "The mark on the track, hidden when `hideMark` is set.",
            },
            content: {
                description: "The default slot label text.",
            },
        },
    },
    contract: {
        properties: [
            {
                id: "position",
                kind: ContractPropertyKind.number,
                description: "The value along the slider range that this label describes.",
            },
            {
                id: "hideMark",
                kind: ContractPropertyKind.boolean,
                description: "Whether the mark on the track is hidden.",
            },
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction of its slider's track, set by the slider.",
                enumValues: [
                    { id: "horizontal", description: "Labels along a horizontal track." },
                    { id: "vertical", description: "Labels along a vertical track." },
                ],
            },
        ],
        slots: [
            {
                id: "default",
                description: "The label text.",
            },
        ],
    },
});
