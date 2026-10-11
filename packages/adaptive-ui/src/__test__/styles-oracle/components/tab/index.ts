import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/index.js";
import { itemStyles } from "../../../../reference/index.js";

// Adapted from the Adaptive Web Components `tab`.

export const TabConditions = {
};

export const TabParts = {
};

export const TabAnatomy: ComponentAnatomy<typeof TabConditions, typeof TabParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TabConditions,
    parts: TabParts,
    focus: Focus.contextFocused(),
};

export const tabStyleModules: StyleRules = [
    {
        styles: itemStyles,
    },
];
