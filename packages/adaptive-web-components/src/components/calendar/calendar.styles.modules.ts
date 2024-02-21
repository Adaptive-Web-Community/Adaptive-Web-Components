import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
import { CalendarAnatomy } from "./calendar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: plainTextStyles,
    },
    {
        target : {
            part: CalendarAnatomy.parts.day,
        },
        styles: controlShapeStyles,
    },
];
