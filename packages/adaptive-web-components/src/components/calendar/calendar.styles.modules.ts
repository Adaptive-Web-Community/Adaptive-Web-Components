import { StyleModules } from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
import { CalendarAnatomy } from "./calendar.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        plainTextStyles
    ],
    [
        {
            part: CalendarAnatomy.parts.day
        },
        controlShapeStyles
    ],
];
