import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    typeRampBaseStyles
} from "@adaptive-web/adaptive-ui/reference";
import { DisclosureAnatomy } from "./disclosure.template.js";

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
            part: DisclosureAnatomy.parts.invoker,
        },
        styles: [
            controlShapeStyles,
            controlDensityStyles,
            accentFillReadableControlStyles,
        ]
    },
];
