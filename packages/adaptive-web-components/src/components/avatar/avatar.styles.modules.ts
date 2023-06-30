import { StyleModules } from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableControlStyles,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { AvatarAnatomy } from "./avatar.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampBaseStyles
    ],
    [
        {
            part: AvatarAnatomy.parts.backplate,
        },
        accentFillReadableControlStyles
    ],
];
