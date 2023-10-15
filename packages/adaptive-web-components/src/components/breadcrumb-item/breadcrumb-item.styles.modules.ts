import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
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
        plainTextStyles,
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.control,
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
            ],
        )
    ],
    [
        {
            hostCondition: BreadcrumbItemAnatomy.interactivity?.interactivitySelector,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        accentForegroundReadableControlStyles,
    ],
];
