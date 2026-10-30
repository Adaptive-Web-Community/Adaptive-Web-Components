import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            borderFillBottom: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleBottom: "solid",
            borderThicknessBottom: tokens.shape.strokeThickness.default,
        }
    },
];
