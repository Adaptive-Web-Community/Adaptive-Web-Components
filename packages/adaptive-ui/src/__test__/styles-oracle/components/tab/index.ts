import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const tokens = refs<ReferenceLibraryTokens>();

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

export const tabStyleRules: StyleRules = [
    {
        treatments: [tokens.treatments.itemControl],
    },
];
