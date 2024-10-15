import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadable,
    designUnit,
    neutralFillSubtle,
} from "@adaptive-web/adaptive-ui/reference";
import { ProgressAnatomy } from "./progress.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            backgroundFill: neutralFillSubtle.rest,
            cornerRadius: designUnit,
        },
    },
    {
        target : {
            part: ProgressAnatomy.parts.indicator,
        },
        properties: {
            backgroundFill: accentFillReadable.rest,
            cornerRadius: designUnit,
        },
    },
];
