import {
    inputStyles,
    labelTextStyles,
    StyleModules,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui";
import { NumberFieldAnatomy } from "./number-field.template.js";

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
            part: NumberFieldAnatomy.parts.label
        },
        labelTextStyles
    ],
    [
        {
            part: NumberFieldAnatomy.parts.root
        },
        inputStyles
    ],
];
