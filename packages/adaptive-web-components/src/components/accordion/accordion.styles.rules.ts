import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        treatments: [tokens.treatments.textPlain],
        properties : {
            borderFillTop: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleTop: "solid",
            borderThicknessTop: tokens.shape.strokeThickness.default,
        }
    },
];
