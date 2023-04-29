import {
    inputStyles,
    labelTextStyles,
    neutralFillStealthControlStyles,
    StyleModules,
    typeRampBaseStyles,
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
        },
        typeRampBaseStyles
    ],
    [
        {
            part: SearchAnatomy.parts.label
        },
        labelTextStyles
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
