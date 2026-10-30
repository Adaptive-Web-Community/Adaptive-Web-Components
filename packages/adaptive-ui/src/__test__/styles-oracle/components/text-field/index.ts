import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";

const tokens = refs<ReferenceLibraryTokens>();
const { density } = tokens;

// Adapted from the Adaptive Web Components `text-field`.

export const TextFieldConditions = {
};

export const TextFieldParts = {
    label: "label",
    root: "root",
    control: "control",
};

export const TextFieldAnatomy: ComponentAnatomy<typeof TextFieldConditions, typeof TextFieldParts> = {
    interactivity: Interactivity.disabledAttribute,
    conditions: TextFieldConditions,
    parts: TextFieldParts,
    focus: Focus.partWithin("root", "control"),
};

export const textFieldStyleModules: StyleRules = [
    {
        treatments: [tokens.typography.ramp.default.treatments.base],
        properties: {
            gap: density.control.vertical.gap,
        },
    },
    {
        target: {
            part: TextFieldAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target: {
            part: TextFieldAnatomy.parts.root,
        },
        treatments: [tokens.treatments.inputAutofillControl],
    },
    {
        target: {
            part: TextFieldAnatomy.parts.control,
        },
        treatments: [tokens.density.control.treatment.autofillInner],
    },
];
