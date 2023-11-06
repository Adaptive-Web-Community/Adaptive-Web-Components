import { StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { densityControl, neutralStrokeStrong } from "@adaptive-web/adaptive-ui/reference";
import { ToolbarAnatomy } from "./toolbar.template.js";

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
            foregroundFill: neutralStrokeStrong,
            gap: densityControl.horizontalGap,
        }),
    ],
    [
        {
            part: ToolbarAnatomy.parts.positioningRegion,
        },
        Styles.fromProperties({
            gap: densityControl.horizontalGap,
        }),
    ],
];
