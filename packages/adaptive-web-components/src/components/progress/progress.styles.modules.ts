import {
    CornerRadius,
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentFillReadableRest,
    designUnitDimension,
    neutralFillSubtleRest
} from "@adaptive-web/adaptive-ui/reference";
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
            backgroundFill: neutralFillSubtleRest,
            ...CornerRadius.all(designUnitDimension),
        })
    ],
    [
        {
            part: ProgressAnatomy.parts.indicator
        },
        Styles.fromProperties({
            backgroundFill: accentFillReadableRest,
            ...CornerRadius.all(designUnitDimension),
        })
    ],
];
