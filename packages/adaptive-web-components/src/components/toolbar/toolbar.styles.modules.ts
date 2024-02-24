import { StyleRules } from "@adaptive-web/adaptive-ui";
import { densityControl, neutralStrokeStrong } from "@adaptive-web/adaptive-ui/reference";
import { ToolbarAnatomy } from "./toolbar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            foregroundFill: neutralStrokeStrong,
            gap: densityControl.horizontalGap,
        },
    },
    {
        target : {
            part: ToolbarAnatomy.parts.positioningRegion,
        },
        properties: {
            gap: densityControl.horizontalGap,
        },
    },
];
