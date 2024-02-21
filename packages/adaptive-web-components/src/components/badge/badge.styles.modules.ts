import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    neutralFillReadableControlStyles,
    typeRampMinus1Styles,
} from "@adaptive-web/adaptive-ui/reference";
import { BadgeAnatomy } from "./badge.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: typeRampMinus1Styles,
    },
    {
        target : {
            part: BadgeAnatomy.parts.control,
        },
        styles: [
            controlShapeStyles,
            neutralFillReadableControlStyles,
        ],
    },
];
