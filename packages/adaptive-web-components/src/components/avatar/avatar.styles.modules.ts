import {
    accentFillReadableControlStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { AvatarAnatomy } from "./avatar.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: AvatarAnatomy.parts.backplate,
        },
        accentFillReadableControlStyles
    ],
];
