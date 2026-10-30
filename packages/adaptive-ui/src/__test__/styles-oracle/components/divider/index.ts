import { refs } from "design-token-library";
import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color, shape } = refs<ReferenceLibraryTokens>();

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

export const dividerStyleRules: StyleRules = [
    {
        target: {
            contextCondition: DividerAnatomy.conditions.orientation.horizontal,
        },
        properties: {
            borderFillTop: { rest: color.neutral.stroke.subtle },
            borderStyleTop: "solid",
            borderThicknessTop: shape.strokeThickness.default,
        },
    },
    {
        target: {
            contextCondition: DividerAnatomy.conditions.orientation.vertical,
        },
        properties: {
            borderFillLeft: { rest: color.neutral.stroke.subtle },
            borderStyleLeft: "solid",
            borderThicknessLeft: shape.strokeThickness.default,
        },
    },
];
