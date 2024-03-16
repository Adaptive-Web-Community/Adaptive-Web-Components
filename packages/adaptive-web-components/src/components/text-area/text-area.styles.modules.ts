import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    densityControl,
    inputStyles,
    labelTextStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { TextAreaAnatomy } from "./text-area.template.js";

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
            part: TextAreaAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: TextAreaAnatomy.parts.control,
        },
        styles: inputStyles,
    },
];
