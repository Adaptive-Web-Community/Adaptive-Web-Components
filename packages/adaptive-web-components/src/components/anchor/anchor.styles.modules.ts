import {
    actionStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
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
        actionStyles
    ],
];
