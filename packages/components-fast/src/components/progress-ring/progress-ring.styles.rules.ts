import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ProgressRingAnatomy } from "./progress-ring.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        properties: {
            foregroundFill: { rest: tokens.color.neutral.fill.subtle }
        },
    },
    {
        target : {
            part: ProgressRingAnatomy.parts.indicator,
        },
        properties: {
            foregroundFill: { rest: tokens.color.accent.fill.readable }
        },
    },
];
