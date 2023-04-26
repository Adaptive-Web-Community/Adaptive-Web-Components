import {
    accentFillReadableControlStyles,
    StyleModules,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui";
import { DisclosureAnatomy } from "./disclosure.template.js";

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
            part: DisclosureAnatomy.parts.invoker
        },
        accentFillReadableControlStyles
    ],
];
