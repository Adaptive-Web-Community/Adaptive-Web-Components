import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/index.js";
import {
    controlDensityStyles,
    controlShapeStyles,
    neutralFillSubtle,
    plainTextStyles,
    shadowTooltipStyles,
} from "../../../../reference/index.js";

// Adapted from the Adaptive Web Components `tooltip`.

export const TooltipConditions = {
    show: "[show='true']",
    visible: "[visible]",
};

export const TooltipParts = {
};

export const TooltipAnatomy: ComponentAnatomy<typeof TooltipConditions, typeof TooltipParts> = {
    interactivity: Interactivity.never,
    conditions: TooltipConditions,
    parts: TooltipParts,
};

export const tooltipStyleModules: StyleRules = [
    {
        styles: [
            controlShapeStyles,
            controlDensityStyles,
            plainTextStyles,
            shadowTooltipStyles,
        ],
        properties: {
            backgroundFill: neutralFillSubtle.rest,
        },
    },
];
