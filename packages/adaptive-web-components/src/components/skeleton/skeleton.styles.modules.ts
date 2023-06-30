import { StyleModules } from "@adaptive-web/adaptive-ui";
import { controlShapeStyles } from "@adaptive-web/adaptive-ui/reference";
import { SkeletonAnatomy } from "./skeleton.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            hostCondition: SkeletonAnatomy.conditions.rectangle
        },
        controlShapeStyles
    ]
];
