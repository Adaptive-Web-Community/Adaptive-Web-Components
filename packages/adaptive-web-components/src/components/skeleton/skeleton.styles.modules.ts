import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { controlShapeStyles, neutralFillSubtleRest, roundShapeStyles } from "@adaptive-web/adaptive-ui/reference";
import { SkeletonAnatomy } from "./skeleton.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.fromProperties({
            backgroundFill: neutralFillSubtleRest,
        })
    ],
    [
        {
            hostCondition: SkeletonAnatomy.conditions.rectangle,
        },
        controlShapeStyles,
    ],
    [
        {
            hostCondition: SkeletonAnatomy.conditions.circle,
        },
        roundShapeStyles,
    ]
];
