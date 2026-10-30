import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    controlListDensityStyles,
    controlShapeStyles,
    densityControl,
    labelTextStyles,
    neutralOutlineDiscernibleControlStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { ListboxAnatomy } from "./listbox.template.js";

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
            part: ListboxAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: ListboxAnatomy.parts.options,
        },
        styles: [
            controlShapeStyles,
            controlListDensityStyles,
            neutralOutlineDiscernibleControlStyles,
        ],
    },
];
