import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { densityControl, labelTextStyles } from "@adaptive-web/adaptive-ui/reference";
import { RadioGroupAnatomy } from "./radio-group.template.js";

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
            part: RadioGroupAnatomy.parts.label,
        },
        styles: labelTextStyles,
    },
    {
        target : {
            part: RadioGroupAnatomy.parts.positioningRegion,
        },
        properties: {
            gap: densityControl.verticalGap,
        },
    },
];
