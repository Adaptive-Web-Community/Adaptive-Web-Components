import {
    layerShapeStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { DialogAnatomy } from "./dialog.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: DialogAnatomy.parts.control
        },
        layerShapeStyles
    ]
];
