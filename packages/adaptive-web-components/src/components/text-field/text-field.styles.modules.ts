import {
    inputStyles,
    plainTextStyles,
    StyleModules,
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
            part: TextFieldAnatomy.parts.label
        },
        plainTextStyles
    ],
    [
        {
            part: TextFieldAnatomy.parts.root
        },
        inputStyles
    ],
];
