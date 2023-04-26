import {
    inputStyles,
    plainTextStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { TextAreaAnatomy } from "./text-area.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: TextAreaAnatomy.parts.label
        },
        plainTextStyles
    ],
    [
        {
            part: TextAreaAnatomy.parts.control
        },
        inputStyles
    ],
];
