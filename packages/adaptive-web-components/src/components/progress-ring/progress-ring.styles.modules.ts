import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableRest,
    neutralFillSubtleRest
} from "@adaptive-web/adaptive-ui/reference";
import { ProgressRingAnatomy } from "./progress-ring.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        Styles.fromProperties({
            foregroundFill: neutralFillSubtleRest
        })
    ],
    [
        {
            part: ProgressRingAnatomy.parts.indicator
        },
        Styles.fromProperties({
            foregroundFill: accentFillReadableRest
        })
    ],
];
