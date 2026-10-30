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
            tokens.shape.treatments.layer,
            tokens.treatments.textPlain,
            tokens.elevation.card.treatment,
        ],
        properties: {
            backgroundFill: { rest: tokens.color.layer.fill.interactive },
        },
    },
];
