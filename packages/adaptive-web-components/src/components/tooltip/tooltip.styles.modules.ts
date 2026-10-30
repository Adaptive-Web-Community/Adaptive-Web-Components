import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        treatments: [
            tokens.shape.treatments.control,
            tokens.density.control.treatment,
            tokens.treatments.textPlain,
            tokens.elevation.tooltip.treatment,
        ],
        properties: {
            backgroundFill: { rest: tokens.color.neutral.fill.subtle },
        },
    },
];
