import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlShapeStyles,
    densityControl,
    neutralForegroundStrongElementStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { AnchorAnatomy } from "./anchor.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: AnchorAnatomy.parts.control,
        },
        styles: [
            controlShapeStyles,
            typeRampBaseStyles,
            accentForegroundReadableControlStyles,
        ],
        properties: {
            gap: densityControl.horizontalGap,
        },
    },
    {
        target : {
            hostCondition: AnchorAnatomy.conditions.noHref,
            part: AnchorAnatomy.parts.control,
        },
        styles: neutralForegroundStrongElementStyles,
    },
];
