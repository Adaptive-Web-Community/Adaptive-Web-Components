import { Color, ComponentAnatomy, Interactivity, Shadow, StyleRules, Styles } from "../../../../core/index.js";
import { designUnit, neutralFillSubtle, strokeThickness } from "../../../../reference/index.js";

// Stress test for the types of values and style compositions. There's intentionally no `name` or `context` in
// the anatomy, the stylesheet name falls back to the directory name and the context to `:host`.

export const StressValuesAnatomy: ComponentAnatomy<Record<string, never>, Record<string, never>> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: {},
    parts: {},
};

const baseStyles = Styles.fromProperties({
    paddingHorizontal: "8px",
    paddingVertical: "4px",
    opacity: 0, // zero is a meaningful value
    "z-index": 2, // numbers
    transition: "opacity 0.2s", // any other css property, which must use the css name
});

// Nested composition, later styles and properties win.
const composedStyles = Styles.compose(
    [baseStyles, Styles.fromProperties({ opacity: 1, gap: designUnit })],
    { opacity: 0.5, "flex-grow": 0 },
);

export const stressValuesStyleModules: StyleRules = [
    {
        styles: composedStyles,
    },
    {
        // A mix of styles, a shorthand, a design token, and a css directive
        styles: [baseStyles, composedStyles],
        properties: {
            borderThickness: strokeThickness,
            borderStyle: "solid",
            cornerRadius: "4px",
            shadow: new Shadow(Color.parse("#000000")!, 0, 2, 4, 1),
        },
    },
    {
        // Custom interactive values rather than a token set, `null` means there is no style for the state
        properties: {
            backgroundFill: neutralFillSubtle,
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
