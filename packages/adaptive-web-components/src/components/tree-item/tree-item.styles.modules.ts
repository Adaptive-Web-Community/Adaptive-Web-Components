import {
    itemStyles,
    StyleModules,
} from "@adaptive-web/adaptive-ui";
import { TreeItemAnatomy } from "./tree-item.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
            part: TreeItemAnatomy.parts.control
        },
        itemStyles
    ],
];
