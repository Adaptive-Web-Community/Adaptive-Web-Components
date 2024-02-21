import { StyleRules } from "@adaptive-web/adaptive-ui";
import { neutralStrokeSubtle, strokeThickness } from "@adaptive-web/adaptive-ui/reference";
import { DividerAnatomy } from "./divider.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            hostCondition: DividerAnatomy.conditions.horizontal,
        },
        properties: {
            borderFillTop: neutralStrokeSubtle.rest,
            borderStyleTop: "solid",
            borderThicknessTop: strokeThickness,
        },
    },
    {
        target : {
            hostCondition: DividerAnatomy.conditions.vertical,
        },
        properties: {
            borderFillLeft: neutralStrokeSubtle.rest,
            borderStyleLeft: "solid",
            borderThicknessLeft: strokeThickness,
        },
    },
];
