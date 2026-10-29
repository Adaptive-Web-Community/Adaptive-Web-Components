import { refs } from "design-token-library";
import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color } = refs<ReferenceLibraryTokens>();

// Stress test for an interactive component with no focus definition, which has no focus or cursor styles but does
// get the disabled styles on the context.

export const StressNoFocusAnatomy: ComponentAnatomy<Record<string, never>, Record<string, never>> = {
    name: "Stress No Focus",
    interactivity: Interactivity.disabledAttribute,
    conditions: {},
    parts: {},
};

export const stressNoFocusStyleModules: StyleRules = [
    {
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
];
