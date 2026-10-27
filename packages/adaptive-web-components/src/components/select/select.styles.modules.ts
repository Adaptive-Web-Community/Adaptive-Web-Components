import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    flyoutStyles,
    inputStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { SelectAnatomy } from "./select.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: SelectAnatomy.parts.control,
        },
        styles: inputStyles,
    },
    {
        target : {
            part: SelectAnatomy.parts.listbox,
        },
        styles: controlListDensityStyles,
    },
    {
        target : {
            part: SelectAnatomy.parts.listbox,
        },
        styles: flyoutStyles,
    },
];
