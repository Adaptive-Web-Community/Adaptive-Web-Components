import { StyleModules } from "@adaptive-web/adaptive-ui";
import { layerShapeStyles } from "@adaptive-web/adaptive-ui/reference";
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
