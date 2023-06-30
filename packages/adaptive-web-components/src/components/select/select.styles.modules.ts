import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    inputStyles,
    itemContainerDensityStyles,
    layerShapeStyles
} from "@adaptive-web/adaptive-ui/reference";
import { SelectAnatomy } from "./select.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: SelectAnatomy.parts.control
        },
        inputStyles
    ],
    [
        {
            part: SelectAnatomy.parts.listbox
        },
        Styles.compose(
            [
                layerShapeStyles,
                itemContainerDensityStyles,
            ],
        )
    ],
];
