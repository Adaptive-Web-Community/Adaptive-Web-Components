import {
    inputStyles,
    labelTextStyles,
    StyleModules,
    typeRampBaseStyles,
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
        },
        typeRampBaseStyles
    ],
    [
        {
            part: TextAreaAnatomy.parts.label
        },
        labelTextStyles
    ],
    [
        {
            part: TextAreaAnatomy.parts.control
        },
        inputStyles
    ],
];
