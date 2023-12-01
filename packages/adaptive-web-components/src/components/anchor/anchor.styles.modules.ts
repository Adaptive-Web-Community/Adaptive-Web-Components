import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlShapeStyles,
    densityControl,
    neutralForegroundStrongElementStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { AnchorAnatomy } from "./anchor.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: AnchorAnatomy.parts.control,
        },
        Styles.compose([
            controlShapeStyles,
            typeRampBaseStyles,
            accentForegroundReadableControlStyles,
        ],
        {
            gap: densityControl.horizontalGap,
        }),
    ],
    [
        {
            hostCondition: AnchorAnatomy.conditions.noHref,
            part: AnchorAnatomy.parts.control,
        },
        neutralForegroundStrongElementStyles,
    ],
];
