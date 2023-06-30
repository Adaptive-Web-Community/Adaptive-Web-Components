import {
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import {
    itemStyles,
    selectableSelectedStyles,
} from "@adaptive-web/adaptive-ui/reference";
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
