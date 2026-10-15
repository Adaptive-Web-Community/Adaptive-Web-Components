import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    flyoutStyles,
    inputStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { ComboboxAnatomy } from "./combobox.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: ComboboxAnatomy.parts.control,
        },
        styles: inputStyles,
    },
    {
        target : {
            part: ComboboxAnatomy.parts.listbox,
        },
        styles: [
            controlListDensityStyles,
            flyoutStyles,
        ],
    },
];
