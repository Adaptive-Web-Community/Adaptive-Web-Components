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
            contextCondition: BreadcrumbItemAnatomy.conditions.noHref,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        styles: neutralForegroundStrongElementStyles,
    },
    {
        target : {
            contextCondition: BreadcrumbItemAnatomy.interactivity?.interactive,
            part: BreadcrumbItemAnatomy.parts.control,
            partCondition: BreadcrumbItemAnatomy.conditions.current,
        },
        styles: neutralForegroundStrongElementStyles,
    },
    {
        target : {
            contextCondition: BreadcrumbItemAnatomy.interactivity?.interactive,
            part: BreadcrumbItemAnatomy.parts.control,
        },
        styles: accentForegroundReadableControlStyles,
    },
];
