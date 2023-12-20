import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    flyoutStyles,
    inputStyles,
    itemContainerDensityStyles,
} from "@adaptive-web/adaptive-ui/reference";
import { ComboboxAnatomy } from "./combobox.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: ComboboxAnatomy.parts.control
        },
        inputStyles
    ],
    [
        {
            part: ComboboxAnatomy.parts.listbox
        },
        Styles.compose(
            [
                itemContainerDensityStyles,
                flyoutStyles,
            ],
        )
    ],
];
