import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ProgressAnatomy } from "./progress.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            backgroundFill: { rest: tokens.color.neutral.fill.subtle },
            cornerRadius: tokens.global.designUnit,
        },
    },
    {
        target : {
            part: ProgressAnatomy.parts.indicator,
        },
        properties: {
            backgroundFill: { rest: tokens.color.accent.fill.readable },
            cornerRadius: tokens.global.designUnit,
        },
    },
];
