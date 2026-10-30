import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { CalendarAnatomy } from "./calendar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
    },
    {
        target : {
            part: CalendarAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: CalendarAnatomy.parts.day,
        },
        treatments: [tokens.shape.treatments.control],
    },
];
