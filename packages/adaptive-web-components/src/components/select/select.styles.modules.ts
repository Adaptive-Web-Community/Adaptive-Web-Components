import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    densityControl,
    flyoutStyles,
    inputStyles,
    labelTextStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { SelectAnatomy } from "./select.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            gap: densityControl.verticalGap,
        },
    },
    {
        target : {
            part: SelectAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
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
