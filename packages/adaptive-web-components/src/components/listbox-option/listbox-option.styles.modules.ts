import {
    itemStyles,
    selectableSelectedStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { ListboxOptionAnatomy } from "./listbox-option.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        itemStyles
    ],
    [
        {
            hostCondition: ListboxOptionAnatomy.conditions.selected,
        },
        selectableSelectedStyles
    ],
];
