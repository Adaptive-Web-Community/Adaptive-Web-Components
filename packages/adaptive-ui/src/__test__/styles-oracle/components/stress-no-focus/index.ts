import { ComponentAnatomy, Interactivity, StyleRules } from "../../../../core/index.js";
import { neutralFillSubtle } from "../../../../reference/index.js";

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
        properties: { backgroundFill: neutralFillSubtle },
    },
];
