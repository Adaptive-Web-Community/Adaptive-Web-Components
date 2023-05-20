import {
    autofillInnerDensityStyles,
    inputAutofillStyles,
    labelTextStyles,
    StyleModules,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui";
import { TextFieldAnatomy } from "./text-field.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampBaseStyles
    ],
    [
        {
            part: TextFieldAnatomy.parts.label
        },
        labelTextStyles
    ],
    [
        {
            part: TextFieldAnatomy.parts.root
        },
        inputAutofillStyles
    ],
    [
        {
            part: TextFieldAnatomy.parts.control
        },
        autofillInnerDensityStyles
    ],
];
