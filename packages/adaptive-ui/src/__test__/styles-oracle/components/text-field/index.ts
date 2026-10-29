import { refs } from "design-token-library";
import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/styles/index.js";
import { ReferenceLibraryTokens } from "../../../../reference/library.js";
import {
    autofillInnerDensityTreatment,
    inputAutofillTreatment,
    labelTextTreatment,
    typeRampBaseTreatment,
} from "../../../../reference/treatments.js";

const { density } = refs<ReferenceLibraryTokens>();

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
        treatments: [typeRampBaseTreatment],
        properties: {
            gap: density.control.vertical.gap,
        },
    },
    {
        target: {
            part: TextFieldAnatomy.parts.label,
        },
        treatments: [labelTextTreatment],
    },
    {
        target: {
            part: TextFieldAnatomy.parts.root,
        },
        treatments: [inputAutofillTreatment],
    },
    {
        target: {
            part: TextFieldAnatomy.parts.control,
        },
        treatments: [autofillInnerDensityTreatment],
    },
];
