import {
    controlShapeStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
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
