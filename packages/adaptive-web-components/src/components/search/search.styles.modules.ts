import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    densityControl,
    inputStyles,
    labelTextStyles,
    neutralFillStealthControlStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SearchAnatomy } from "./search.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: typeRampBaseStyles,
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target : {
            part: SearchAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: SearchAnatomy.parts.root,
        },
        styles: inputStyles,
    },
    {
        target : {
            part: SearchAnatomy.parts.clearButton,
        },
        styles: [
            controlShapeStyles,
            neutralFillStealthControlStyles,
        ],
    },
];
