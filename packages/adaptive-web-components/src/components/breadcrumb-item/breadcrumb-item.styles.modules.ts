import {
    accentForegroundReadableControlStyles,
    plainTextStyles,
    StyleModules,
    typeRampBaseStyles,
} from "@adaptive-web/adaptive-ui";
import { BreadcrumbItemAnatomy } from "./breadcrumb-item.template.js";

/**
 * Visual styles composed by modules.
 * 
 * @public
 */
export const styleModules: StyleModules = [
    [
        {
        },
        typeRampBaseStyles
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.control,
        },
        accentForegroundReadableControlStyles
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.separator,
        },
        plainTextStyles
    ],
];
