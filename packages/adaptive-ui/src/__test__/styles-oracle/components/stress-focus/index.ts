import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const { color } = refs<ReferenceLibraryTokens>();

// Stress test for a focus indicator on a child, a focus reset target, and an explicit cursor.

export const StressFocusParts = {
    // The focus helpers use the part name as the selector, so these are element names.
    indicator: "indicator",
    handle: ".handle",
};

export const StressFocusAnatomy: ComponentAnatomy<Record<string, never>, typeof StressFocusParts> = {
    name: "StressFocus",
    context: ".stress-focus",
    interactivity: Interactivity.disabledClass,
    conditions: {},
    parts: StressFocusParts,
    focus: Focus.contextChildFocused("indicator"),
    cursor: {
        part: StressFocusParts.handle,
        cursorType: "grab",
    },
};

export const stressFocusStyleRules: StyleRules = [
    {
        target: {
            part: StressFocusAnatomy.parts.indicator,
            stateOnContext: true,
        },
        properties: { backgroundFill: color.neutral.fill.subtle },
    },
];
