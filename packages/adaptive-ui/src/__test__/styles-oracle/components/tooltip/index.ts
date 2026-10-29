import { refs } from "design-token-library";
import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";
import {
    controlDensityTreatment,
    controlShapeTreatment,
    plainTextTreatment,
    shadowTooltipTreatment,
} from "../../../../reference/treatments.js";

const { color } = refs<ReferenceLibraryTokens>();

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
        treatments: [
            controlShapeTreatment,
            controlDensityTreatment,
            plainTextTreatment,
            shadowTooltipTreatment,
        ],
        properties: {
            backgroundFill: { rest: color.neutral.fill.subtle },
        },
    },
];
