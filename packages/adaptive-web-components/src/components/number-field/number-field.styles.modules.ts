import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    autofillInnerDensityStyles,
    densityControl,
    inputAutofillStyles,
    labelTextStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { NumberFieldAnatomy } from "./number-field.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: typeRampBaseStyles,
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.root,
        },
        styles: inputAutofillStyles,
    },
    {
        target : {
            part: NumberFieldAnatomy.parts.control,
        },
        styles: autofillInnerDensityStyles,
    },
];
