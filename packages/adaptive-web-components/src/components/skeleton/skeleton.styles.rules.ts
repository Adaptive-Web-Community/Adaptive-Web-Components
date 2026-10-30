import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { SkeletonAnatomy } from "./skeleton.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        properties: {
            backgroundFill: { rest: tokens.color.neutral.fill.subtle },
        },
    },
    {
        target : {
            contextCondition: SkeletonAnatomy.conditions.shape.rectangle,
        },
        treatments: [tokens.shape.treatments.control],
    },
    
    {
        target : {
            contextCondition: SkeletonAnatomy.conditions.shape.circle,
        },
        treatments: [tokens.shape.treatments.round],
    },
];
