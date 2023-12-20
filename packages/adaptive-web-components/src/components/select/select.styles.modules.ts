import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    controlShapeStyles,
    flyoutStyles,
    inputStyles,
    itemContainerDensityStyles,
    neutralOutlineDiscernibleControlStyles,
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
                itemContainerDensityStyles,
            ],
        )
    ],
    [
        {
            hostCondition: SelectAnatomy.conditions.isListbox,
            part: SelectAnatomy.parts.listbox
        },
        Styles.compose(
            [
                controlShapeStyles,
                neutralOutlineDiscernibleControlStyles,
            ],
        )
    ],
    [
        {
            hostCondition: SelectAnatomy.conditions.isDropdown,
            part: SelectAnatomy.parts.listbox
        },
        flyoutStyles,
    ],
];
