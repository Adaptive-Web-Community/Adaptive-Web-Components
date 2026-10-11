import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/index.js";
import { neutralFillSubtle } from "../../../../reference/index.js";

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

export const stressFocusStyleModules: StyleRules = [
    {
        target: {
            part: StressFocusAnatomy.parts.indicator,
            stateOnContext: true,
        },
        properties: { backgroundFill: neutralFillSubtle },
    },
];
