import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    densityControl,
    highlightFillReadableControlStyles,
    labelTextStyles,
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
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target : {
            part: SliderAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
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
