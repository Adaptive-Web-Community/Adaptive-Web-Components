import { StyleRules } from "@adaptive-web/adaptive-ui";
import { controlShapeStyles, neutralFillSubtleRest, roundShapeStyles } from "@adaptive-web/adaptive-ui/reference";
import { SkeletonAnatomy } from "./skeleton.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            backgroundFill: neutralFillSubtleRest,
        },
    },
    {
        target : {
            contextCondition: SkeletonAnatomy.conditions.shape.rectangle,
        },
        styles: controlShapeStyles,
    },
    
    {
        target : {
            contextCondition: SkeletonAnatomy.conditions.shape.circle,
        },
        styles: roundShapeStyles,
    },
];
