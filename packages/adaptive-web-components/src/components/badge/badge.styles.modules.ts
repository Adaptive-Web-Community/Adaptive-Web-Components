import {
    neutralFillReadableControlStyles,
    StyleModules,
    typeRampMinus1Styles,
} from "@adaptive-web/adaptive-ui";
import { BadgeAnatomy } from "./badge.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampMinus1Styles
    ],
    [
        {
            part: BadgeAnatomy.parts.control,
        },
        neutralFillReadableControlStyles
    ],
];
