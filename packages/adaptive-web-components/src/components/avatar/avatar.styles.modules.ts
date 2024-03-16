import { StyleRules } from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableControlStyles,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { AvatarAnatomy } from "./avatar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: typeRampBaseStyles,
    },
    {
        target : {
            part: AvatarAnatomy.parts.backplate,
        },
        styles: accentFillReadableControlStyles,
    },
];
