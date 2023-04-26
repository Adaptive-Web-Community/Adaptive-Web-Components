import {
    inputStyles,
    plainTextStyles,
    StyleModules,
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
            part: NumberFieldAnatomy.parts.label
        },
        plainTextStyles
    ],
    [
        {
            part: NumberFieldAnatomy.parts.root
        },
        inputStyles
    ],
];
