import { refs } from "design-token-library";
import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const tokens = refs<ReferenceLibraryTokens>();
const { color } = tokens;

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
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
            tokens.treatments.textPlain,
            tokens.elevation.tooltip.treatment,
        ],
        properties: {
            backgroundFill: { rest: color.neutral.fill.subtle },
        },
    },
];
