import {
    controlShapeStyles,
    inputStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { SelectAnatomy } from "./select.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        inputStyles
    ],
    [
        {
            part: SelectAnatomy.parts.listbox
        },
        controlShapeStyles
    ],
];
