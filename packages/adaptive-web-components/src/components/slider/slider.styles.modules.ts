import {
    controlShapeStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
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
