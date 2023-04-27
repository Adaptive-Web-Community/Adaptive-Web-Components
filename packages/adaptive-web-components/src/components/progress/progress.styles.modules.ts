import {
    accentFillReadableRest,
    neutralFillSubtleRest,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import { ProgressAnatomy } from "./progress.template.js";

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
            backgroundFill: neutralFillSubtleRest
        })
    ],
    [
        {
            part: ProgressAnatomy.parts.indicator
        },
        Styles.fromProperties({
            backgroundFill: accentFillReadableRest
        })
    ],
];
