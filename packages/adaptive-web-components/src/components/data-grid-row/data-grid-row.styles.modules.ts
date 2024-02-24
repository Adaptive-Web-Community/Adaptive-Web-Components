import { StyleRules } from "@adaptive-web/adaptive-ui";
import { neutralStrokeSubtle, strokeThickness } from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            borderFillBottom: neutralStrokeSubtle.rest,
            borderStyleBottom: "solid",
            borderThicknessBottom: strokeThickness,
        }
    },
];
