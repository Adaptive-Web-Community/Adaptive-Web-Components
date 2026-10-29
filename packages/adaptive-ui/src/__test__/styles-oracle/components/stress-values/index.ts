import { hex, refs } from "design-token-library";
import { shadow } from "../../../../core/shadow/index.js";
import { ComponentAnatomy, Interactivity, StyleRules, Treatment } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color, global, shape } = refs<ReferenceLibraryTokens>();

// Stress test for the types of values and style compositions. There's intentionally no `name` or `context` in
// the anatomy, the stylesheet name falls back to the directory name and the context to `:host`.

export const StressValuesAnatomy: ComponentAnatomy<Record<string, never>, Record<string, never>> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: {},
    parts: {},
};

const baseStyles: Treatment = { properties: {
    paddingHorizontal: "8px",
    paddingVertical: "4px",
    opacity: 0, // zero is a meaningful value
    "z-index": 2, // numbers
    transition: "opacity 0.2s", // any other css property, which must use the css name
} };

// Nested composition, later styles and properties win.
const composedStyles: Treatment = {
    treatments: [baseStyles, { properties: { opacity: 1, gap: global.designUnit } }],
    properties: { opacity: 0.5, "flex-grow": 0 },
};

export const stressValuesStyleModules: StyleRules = [
    {
        treatments: [composedStyles],
    },
    {
        // A mix of treatments, a shorthand, a ref to a token, and a value of a token type
        treatments: [baseStyles, composedStyles],
        properties: {
            borderThickness: shape.strokeThickness.default,
            borderStyle: "solid",
            cornerRadius: "4px",
            shadow: shadow(hex("#000000"), 0, 2, 4, 1),
        },
    },
    {
        // Custom interactive values rather than a token set, `null` means there is no style for the state
        properties: {
            backgroundFill: color.neutral.fill.subtle,
            foregroundFill: {
                rest: "black",
                hover: "blue",
                active: "navy",
                focus: null,
                disabled: "gray",
            },
        },
    },
];
