import { StyleModules } from "@adaptive-web/adaptive-ui";
import { controlShapeStyles } from "@adaptive-web/adaptive-ui/reference";
import { SliderAnatomy } from "./slider.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        controlShapeStyles
    ],
    [
        {
            part: SliderAnatomy.parts.trackStart
        },
        controlShapeStyles
    ],
];
