import { Color, StyleModules, Styles } from "@adaptive-web/adaptive-ui";
import { layerFillFixedPlus1, layerShapeStyles, shadowDialogStyles } from "@adaptive-web/adaptive-ui/reference";
import { DialogAnatomy } from "./dialog.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: DialogAnatomy.parts.control,
        },
        Styles.compose([
            layerShapeStyles,
            shadowDialogStyles,
        ], {
            backgroundFill: layerFillFixedPlus1
        }),
    ],
    [
        {
            part: DialogAnatomy.parts.overlay,
        },
        Styles.fromProperties({
            backgroundFill: Color.fromRgb(0, 0, 0, 0.3),
        })
    ]
];
