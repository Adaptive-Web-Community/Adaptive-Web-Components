import { rgbColor, StyleRules } from "@adaptive-web/adaptive-ui";
import { tokens } from "../../styles/tokens.js";
import { DialogAnatomy } from "./dialog.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        target : {
            part: DialogAnatomy.parts.control,
        },
        treatments: [
            tokens.shape.treatments.layer,
            tokens.elevation.dialog.treatment,
        ],
        properties: {
            backgroundFill: tokens.color.layer.fill.ramp.plus1
        },
    },
    {
        target : {
            part: `${DialogAnatomy.parts.control}::backdrop`,
        },
        properties: {
            backgroundFill: rgbColor(0, 0, 0, 0.3),
        },
    },
];
