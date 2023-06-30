import {
    StyleModules,
    Styles
} from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    plainTextStyles,
    typeRampBaseStyles
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
        typeRampBaseStyles
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.control,
        },
        Styles.compose(
            [
                controlShapeStyles,
                controlDensityStyles,
                accentForegroundReadableControlStyles,
            ],
        )
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.separator,
        },
        plainTextStyles
    ],
];
