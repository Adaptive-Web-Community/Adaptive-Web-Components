import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    plainTextStyles,
    StyleModules,
    Styles,
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
        Styles.compose(
            controlShapeStyles,
            controlDensityStyles,
            accentForegroundReadableControlStyles
        )
    ],
    [
        {
            part: BreadcrumbItemAnatomy.parts.separator,
        },
        plainTextStyles
    ],
];
