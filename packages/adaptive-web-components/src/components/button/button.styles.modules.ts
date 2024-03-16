import { StyleRules } from "@adaptive-web/adaptive-ui";
import { actionStyles } from "@adaptive-web/adaptive-ui/reference";
import { ButtonAnatomy } from "./button.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: ButtonAnatomy.parts.control,
        },
        styles: actionStyles,
    },
];
