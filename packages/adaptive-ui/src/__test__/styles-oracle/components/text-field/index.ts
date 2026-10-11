import { ComponentAnatomy, Focus, Interactivity, StyleRules } from "../../../../core/index.js";
import {
    autofillInnerDensityStyles,
    densityControl,
    inputAutofillStyles,
    labelTextStyles,
    typeRampBaseStyles,
} from "../../../../reference/index.js";

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
        styles: typeRampBaseStyles,
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target: {
            part: TextFieldAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target: {
            part: TextFieldAnatomy.parts.root,
        },
        styles: inputAutofillStyles,
    },
    {
        target: {
            part: TextFieldAnatomy.parts.control,
        },
        styles: autofillInnerDensityStyles,
    },
];
