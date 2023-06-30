import { StyleModules } from "@adaptive-web/adaptive-ui";
import { actionStyles } from "@adaptive-web/adaptive-ui/reference";
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
