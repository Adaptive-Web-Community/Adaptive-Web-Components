import { StyleRules } from "@adaptive-web/adaptive-ui";
import { fillColor, neutralStrokeStrong } from "@adaptive-web/adaptive-ui/reference";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        properties: {
            backgroundFill: fillColor,
            foregroundFill: neutralStrokeStrong.rest,
        }
    },
];
