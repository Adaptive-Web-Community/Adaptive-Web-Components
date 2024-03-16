import {
    StyleRules,
} from "@adaptive-web/adaptive-ui";
import {
    accentForegroundReadableControlStyles,
    controlDensityStyles,
    controlShapeStyles,
    neutralForegroundStrongElementStyles,
    plainTextStyles
} from "@adaptive-web/adaptive-ui/reference";
import { BreadcrumbItemAnatomy } from "./breadcrumb-item.template.js";

/**
 * Visual styles composed by style rules.
 * 
 * @public
 */
export const styleModules: StyleRules = [
    {
        styles: plainTextStyles,
    },
    {
        target : {
            part: BreadcrumbItemAnatomy.parts.control,
        },
        styles: [
            controlShapeStyles,
            controlDensityStyles,
        ],
    },
    {
        target : {
            hostCondition: BreadcrumbItemAnatomy.conditions.noHref,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        styles: neutralForegroundStrongElementStyles,
    },
    {
        target : {
            hostCondition: BreadcrumbItemAnatomy.interactivity?.interactivitySelector,
            part: BreadcrumbItemAnatomy.parts.control,
            partCondition: BreadcrumbItemAnatomy.conditions.current,
        },
        styles: neutralForegroundStrongElementStyles,
    },
    {
        target : {
            hostCondition: BreadcrumbItemAnatomy.interactivity?.interactivitySelector,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        styles: accentForegroundReadableControlStyles,
    },
];
