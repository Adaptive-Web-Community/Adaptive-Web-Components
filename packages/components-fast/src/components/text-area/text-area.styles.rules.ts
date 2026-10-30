import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { TextAreaAnatomy } from "./text-area.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.typography.ramp.default.treatments.base],
        properties: {
            gap: tokens.density.control.vertical.gap,
        },
    },
    {
        target : {
            part: TextAreaAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: TextAreaAnatomy.parts.control,
        },
        treatments: [tokens.treatments.inputControl],
    },
];
