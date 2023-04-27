import {
    neutralFillReadableControlStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { BadgeAnatomy } from "./badge.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: BadgeAnatomy.parts.control,
        },
        neutralFillReadableControlStyles
    ],
];
