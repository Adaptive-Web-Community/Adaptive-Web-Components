import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { DividerAnatomy } from "./divider.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        target : {
            contextCondition: DividerAnatomy.conditions.orientation.horizontal,
        },
        properties: {
            borderFillTop: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleTop: "solid",
            borderThicknessTop: tokens.shape.strokeThickness.default,
        },
    },
    {
        target : {
            contextCondition: DividerAnatomy.conditions.orientation.vertical,
        },
        properties: {
            borderFillLeft: { rest: tokens.color.neutral.stroke.subtle },
            borderStyleLeft: "solid",
            borderThicknessLeft: tokens.shape.strokeThickness.default,
        },
    },
];
