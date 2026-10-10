import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/index.js";
import { actionStyles } from "../../../../reference/index.js";

// Adapted from the Adaptive Web Components `button`.

export const ButtonConditions = {
    iconOnly: ".icon-only",
};

export const ButtonParts = {
    control: "control",
    content: "content",
};

export const ButtonAnatomy: ComponentAnatomy<typeof ButtonConditions, typeof ButtonParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: ButtonConditions,
    parts: ButtonParts,
    focus: Focus.partFocused("control"),
};

export const buttonStyleModules: StyleRules = [
    {
        target: {
            part: ButtonAnatomy.parts.control,
        },
        styles: actionStyles,
    },
];
