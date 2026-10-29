import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { itemTreatment } from "../../../../reference/treatments.js";

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
        treatments: [itemTreatment],
    },
];
