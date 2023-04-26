import {
    inputStyles,
    neutralFillStealthControlStyles,
    plainTextStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { SearchAnatomy } from "./search.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: SearchAnatomy.parts.label
        },
        plainTextStyles
    ],
    [
        {
            part: SearchAnatomy.parts.root
        },
        inputStyles
    ],
    [
        {
            part: SearchAnatomy.parts.clearButton
        },
        neutralFillStealthControlStyles
    ],
];
