import {
    controlShapeStyles,
    inputStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { ComboboxAnatomy } from "./combobox.template.js";

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
            part: ComboboxAnatomy.parts.listbox
        },
        controlShapeStyles
    ],
];
