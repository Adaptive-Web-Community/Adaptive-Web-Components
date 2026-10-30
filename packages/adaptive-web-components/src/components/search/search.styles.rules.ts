import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { SearchAnatomy } from "./search.template.js";

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
            part: SearchAnatomy.parts.label,
        },
        treatments: [tokens.treatments.textLabel],
    },
    {
        target : {
            part: SearchAnatomy.parts.root,
        },
        treatments: [tokens.treatments.inputControl],
    },
    {
        target : {
            part: SearchAnatomy.parts.clearButton,
        },
        treatments: [
            tokens.shape.treatments.control,
            tokens.color.neutral.treatments.fillStealthControl,
        ],
    },
];
