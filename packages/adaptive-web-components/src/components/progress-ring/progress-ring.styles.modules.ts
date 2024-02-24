import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadable,
    neutralFillSubtle,
} from "@adaptive-web/adaptive-ui/reference";
import { ProgressRingAnatomy } from "./progress-ring.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            foregroundFill: neutralFillSubtle.rest
        },
    },
    {
        target : {
            part: ProgressRingAnatomy.parts.indicator,
        },
        properties: {
            foregroundFill: accentFillReadable.rest
        },
    },
];
