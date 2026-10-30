import { StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { ToolbarAnatomy } from "./toolbar.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleRules: StyleRules = [
    {
        properties: {
            foregroundFill: tokens.color.neutral.stroke.strong,
            gap: tokens.density.control.horizontal.gap,
        },
    },
    {
        target : {
            part: ToolbarAnatomy.parts.positioningRegion,
        },
        properties: {
            gap: tokens.density.control.horizontal.gap,
        },
    },
];
