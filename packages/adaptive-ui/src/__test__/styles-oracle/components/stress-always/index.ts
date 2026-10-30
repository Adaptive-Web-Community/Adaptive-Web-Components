import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color } = refs<ReferenceLibraryTokens>();

// Stress test for a component that is always interactive and can never be disabled, with the focus within.

export const StressAlwaysParts = {
    // The focus helpers use the part name as the selector, so these are element names.
    root: "root",
    control: "control",
};

export const StressAlwaysAnatomy: ComponentAnatomy<Record<string, never>, typeof StressAlwaysParts> = {
    name: "StressAlways",
    context: ".stress-always",
    interactivity: Interactivity.always,
    conditions: {},
    parts: StressAlwaysParts,
    focus: Focus.partWithin("root", "control"),
    cursor: {
        cursorType: "text",
    },
};

export const stressAlwaysStyleRules: StyleRules = [
    {
        target: {
            part: StressAlwaysAnatomy.parts.root,
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
];
