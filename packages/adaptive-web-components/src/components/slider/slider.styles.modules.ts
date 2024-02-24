import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    highlightFillReadableControlStyles,
    neutralStrokeDiscernible,
    roundShapeStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SliderAnatomy } from "./slider.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: controlShapeStyles,
    },
    {
        target : {
            part: SliderAnatomy.parts.track,
        },
        styles: controlShapeStyles,
        properties: {
            backgroundFill: neutralStrokeDiscernible.rest,
        },
    },
    {
        target : {
            part: SliderAnatomy.parts.trackStart,
        },
        styles: [
            controlShapeStyles,
            highlightFillReadableControlStyles,
        ],
    },
    {
        target : {
            part: SliderAnatomy.parts.thumb,
        },
        styles: [
            roundShapeStyles,
            highlightFillReadableControlStyles,
        ],
    },
];
