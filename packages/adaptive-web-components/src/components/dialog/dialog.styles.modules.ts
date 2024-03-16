import { Color, StyleRules } from "@adaptive-web/adaptive-ui";
import { layerFillFixedPlus1, layerShapeStyles, shadowDialogStyles } from "@adaptive-web/adaptive-ui/reference";
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
        styles: [
            layerShapeStyles,
            shadowDialogStyles,
        ],
        properties: {
            backgroundFill: layerFillFixedPlus1
        },
    },
    {
        target : {
            part: DialogAnatomy.parts.overlay,
        },
        properties: {
            backgroundFill: Color.fromRgb(0, 0, 0, 0.3),
        },
    },
];
