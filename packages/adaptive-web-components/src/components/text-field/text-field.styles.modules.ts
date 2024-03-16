import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    autofillInnerDensityStyles,
    densityControl,
    inputAutofillStyles,
    labelTextStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { TextFieldAnatomy } from "./text-field.template.js";

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
        }
    },
    {
        target : {
            part: TextFieldAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: TextFieldAnatomy.parts.root,
        },
        styles: inputAutofillStyles,
    },
    {
        target : {
            part: TextFieldAnatomy.parts.control,
        },
        styles: autofillInnerDensityStyles,
    },
];
