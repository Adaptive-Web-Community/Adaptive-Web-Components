import { ContractPropertyKind, defineDocumentation, DocStatus } from "@adaptive-web/adaptive-ui";
import { labelledDocumentation } from "../utilities/labelled.documentation.js";

/**
 * Typed component documentation for {@link SliderElement}.
 *
 * @public
 */
export const sliderDocumentation = defineDocumentation({
    id: "slider",
    definition:
        'A **Slider** is a value in a range (`role="slider"`), which the user changes with the arrows or by dragging the thumb, as a native `<input type="range">`.',
    governance: {
        status: DocStatus.published,
        lastReviewed: "2026-11-17",
    },
    structure: {
        description:
            "The host is the slider and form control; the `positioningRegion` part holds the track, slider labels, and thumb.",
        interactive: true,
        indicatesFocus: true,
        parts: {
            label: {
                description: "The `label` slot or `label` attribute text that names the slider.",
            },
            positioningRegion: {
                description: "The region of the track, thumb, and labels, with `--slider-position` from the value.",
            },
            track: {
                description: "The track.",
            },
            trackStart: {
                description: "The track from its start to the thumb.",
            },
            thumbContainer: {
                description: "The container of the thumb at the value.",
            },
            thumb: {
                description: "The thumb.",
            },
        },
    },
    contract: {
        include: [labelledDocumentation],
        properties: [
            {
                id: "name",
                kind: ContractPropertyKind.string,
                nullable: true,
                description: "The name of its value in the form data.",
            },
            {
                id: "value",
                kind: ContractPropertyKind.string,
                description:
                    "The value now. Not an attribute: the `value` attribute is the value by default, before the user or code changes it and when its form is reset.",
            },
            {
                id: "min",
                kind: ContractPropertyKind.number,
                description: "The lowest value. The default is 0.",
            },
            {
                id: "max",
                kind: ContractPropertyKind.number,
                description: "The highest value. The default is 100.",
            },
            {
                id: "step",
                kind: ContractPropertyKind.number,
                description: "The step between values, from `min`. The default is 1.",
            },
            {
                id: "orientation",
                kind: ContractPropertyKind.enum,
                description: "The direction of the track.",
                enumValues: [
                    { id: "horizontal", description: "The track runs horizontally." },
                    { id: "vertical", description: "The track runs vertically." },
                ],
            },
            {
                id: "disabled",
                kind: ContractPropertyKind.boolean,
                description:
                    "Whether it is disabled. A disabled `<fieldset>` around it disables it too, which this doesn't reflect: select `:disabled`.",
            },
            {
                id: "readOnly",
                kind: ContractPropertyKind.boolean,
                description: "Whether it is read only: it takes focus, and the user can't change the value.",
            },
        ],
        slots: [
            {
                id: "track",
                description: "Replaces the default track.",
            },
            {
                id: "track-start",
                description: "Replaces the default filled portion of the track.",
            },
            {
                id: "thumb",
                description: "Replaces the default thumb.",
            },
            {
                id: "default",
                description: "Slider labels along the track.",
            },
        ],
    },
});
