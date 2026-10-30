import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { SliderAnatomy } from "./slider.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: SliderAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        treatments: [tokens.shape.treatments.control],
    },
    {
        target : {
            part: SliderAnatomy.parts.track,
        },
        treatments: [tokens.shape.treatments.control],
        properties: {
            backgroundFill: { rest: tokens.color.neutral.stroke.discernible },
        },
    },
    {
        target : {
            part: SliderAnatomy.parts.trackStart,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.color.highlight.treatments.fillReadableControl,
        ],
    },
    {
        target : {
            part: SliderAnatomy.parts.thumb,
        },
        treatments: [
            tokens.shape.treatments.round,
            tokens.color.highlight.treatments.fillReadableControl,
        ],
    },
];
