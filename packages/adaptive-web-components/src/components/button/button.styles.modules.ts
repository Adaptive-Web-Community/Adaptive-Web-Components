import { StyleModules } from "@adaptive-web/adaptive-ui";
import { actionStyles } from "@adaptive-web/adaptive-ui/reference";
import { ButtonAnatomy } from "./button.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: ButtonAnatomy.parts.control,
        },
        actionStyles
    ],
];
