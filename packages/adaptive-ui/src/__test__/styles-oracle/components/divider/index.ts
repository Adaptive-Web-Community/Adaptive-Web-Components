import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/index.js";
import { neutralStrokeSubtle, strokeThickness } from "../../../../reference/index.js";

// Adapted from the Adaptive Web Components `divider`.

export const DividerConditions = {
    orientation: {
        horizontal: "[orientation='horizontal']",
        vertical: "[orientation='vertical']",
    },
};

export const DividerParts = {
};

export const DividerAnatomy: ComponentAnatomy<typeof DividerConditions, typeof DividerParts> = {
    interactivity: Interactivity.never,
    conditions: DividerConditions,
    parts: DividerParts,
};

export const dividerStyleModules: StyleRules = [
    {
        target: {
            contextCondition: DividerAnatomy.conditions.orientation.horizontal,
        },
        properties: {
            borderFillTop: neutralStrokeSubtle.rest,
            borderStyleTop: "solid",
            borderThicknessTop: strokeThickness,
        },
    },
    {
        target: {
            contextCondition: DividerAnatomy.conditions.orientation.vertical,
        },
        properties: {
            borderFillLeft: neutralStrokeSubtle.rest,
            borderStyleLeft: "solid",
            borderThicknessLeft: strokeThickness,
        },
    },
];
